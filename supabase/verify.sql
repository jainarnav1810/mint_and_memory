-- verify.sql — post-migration checks.
--
-- Paste into the Supabase SQL editor (Dashboard → SQL Editor) after applying
-- 001, 002, and 003. Every query prints its own PASS/FAIL, so you can read the
-- whole thing top to bottom rather than interpreting raw rows.
--
-- Safe to re-run: it only reads, except for the final anon-write probe, which
-- rolls itself back.

-- ---------------------------------------------------------------------------
-- 1. RLS is enabled on all five tables
-- ---------------------------------------------------------------------------
select
  tablename,
  case when rowsecurity then 'PASS' else 'FAIL — RLS OFF' end as status
from pg_tables
where schemaname = 'public'
  and tablename in ('profiles', 'listings', 'listing_images', 'bids', 'orders')
order by tablename;

-- ---------------------------------------------------------------------------
-- 2. No permissive `using (true)` write policies survive
-- ---------------------------------------------------------------------------
-- Expect zero rows. Any row here is a table anyone with the anon key can write.
select
  tablename,
  policyname,
  cmd,
  'FAIL — permissive write policy' as status
from pg_policies
where schemaname = 'public'
  and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
  and coalesce(qual, 'true') = 'true'
  and coalesce(with_check, 'true') = 'true';

-- ---------------------------------------------------------------------------
-- 3. The specific policies 001 shipped are gone
-- ---------------------------------------------------------------------------
select
  expected.policyname,
  case when p.policyname is null then 'PASS — dropped' else 'FAIL — still present' end as status
from (values
  ('Public insert listings'),
  ('Public update listings'),
  ('Public insert images'),
  ('Public insert bids'),
  ('Public insert orders'),
  ('Public read orders'),
  ('Public profile read')
) as expected(policyname)
left join pg_policies p
  on p.schemaname = 'public' and p.policyname = expected.policyname;

-- ---------------------------------------------------------------------------
-- 4. place_bid has the hardened 2-argument signature
-- ---------------------------------------------------------------------------
-- Expect exactly one row: (p_listing_id uuid, p_amount numeric).
-- A 3-argument version means 001's spoofable function is still installed.
select
  pg_get_function_identity_arguments(p.oid) as signature,
  p.prosecdef as security_definer,
  case
    when pg_get_function_identity_arguments(p.oid) = 'p_listing_id uuid, p_amount numeric'
      then 'PASS'
    else 'FAIL — wrong signature, bidder can be spoofed'
  end as status
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'place_bid';

-- anon must not be able to execute it
select
  case
    when has_function_privilege('anon', 'public.place_bid(uuid, numeric)', 'execute')
      then 'FAIL — anon can bid'
    else 'PASS — anon cannot bid'
  end as status;

-- ---------------------------------------------------------------------------
-- 5. Buyers cannot promote themselves to admin
-- ---------------------------------------------------------------------------
select
  case
    when has_column_privilege('authenticated', 'public.profiles', 'role', 'update')
      then 'FAIL — authenticated can write profiles.role'
    else 'PASS — role is service-role only'
  end as status;

-- ...but can still edit their own display fields
select
  case
    when has_column_privilege('authenticated', 'public.profiles', 'full_name', 'update')
      then 'PASS — full_name writable'
    else 'FAIL — profile edits blocked entirely'
  end as status;

-- ---------------------------------------------------------------------------
-- 6. Razorpay reconciliation columns exist
-- ---------------------------------------------------------------------------
select
  expected.column_name,
  case when c.column_name is null then 'FAIL — missing' else 'PASS' end as status
from (values ('razorpay_order_id'), ('razorpay_payment_id')) as expected(column_name)
left join information_schema.columns c
  on c.table_schema = 'public'
  and c.table_name = 'orders'
  and c.column_name = expected.column_name;

-- ---------------------------------------------------------------------------
-- 7. Profile provisioning trigger is attached to auth.users
-- ---------------------------------------------------------------------------
select
  case when count(*) = 1 then 'PASS' else 'FAIL — signups will not create profiles' end as status
from pg_trigger
where tgname = 'on_auth_user_created' and not tgisinternal;

-- Every existing auth user has a profile
select
  count(*) as users_without_profile,
  case when count(*) = 0 then 'PASS' else 'FAIL — backfill incomplete' end as status
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- ---------------------------------------------------------------------------
-- 8. Storage bucket + policies (from 003)
-- ---------------------------------------------------------------------------
select
  case when exists (select 1 from storage.buckets where id = 'listing-images' and public)
    then 'PASS — bucket exists and is public'
    else 'FAIL — create the listing-images bucket'
  end as status;

select
  count(*) as listing_image_policies,
  case when count(*) >= 4 then 'PASS' else 'FAIL — add policies via Storage → Policies' end as status
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname like '%listing images%';

-- ---------------------------------------------------------------------------
-- 9. Anonymous write is actually refused
-- ---------------------------------------------------------------------------
-- The real proof. Runs in a transaction that always rolls back.
begin;
set local role anon;

do $$
begin
  insert into public.listings (title, category, country_of_origin, listing_type)
  values ('RLS probe — should never persist', 'coin', 'Nowhere', 'fixed');
  raise warning 'FAIL — anonymous insert into listings SUCCEEDED';
exception
  when insufficient_privilege then
    raise notice 'PASS — anonymous insert refused by RLS';
end;
$$;

-- Anonymous read of orders must return nothing (this is the shipping-address leak).
do $$
declare
  n int;
begin
  select count(*) into n from public.orders;
  if n = 0 then
    raise notice 'PASS — anonymous sees 0 orders';
  else
    raise warning 'FAIL — anonymous can read % order rows', n;
  end if;
exception
  when insufficient_privilege then
    raise notice 'PASS — anonymous order read refused';
end;
$$;

rollback;
