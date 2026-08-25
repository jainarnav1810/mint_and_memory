-- 002_auth_rls_storage.sql
-- Authentication plumbing and hardened row-level security.
-- (The storage bucket it originally carried now lives in 003_storage.sql.)
--
-- Migration 001 shipped write policies of the form `using (true)`. Because the
-- anon key is public by design (it is embedded in every browser bundle), those
-- policies let anyone rewrite listings, forge orders, and read every buyer's
-- email and shipping address. This migration replaces them with owner- and
-- admin-scoped rules, and rewrites `place_bid` so a bidder identity cannot be
-- spoofed.

-- ---------------------------------------------------------------------------
-- 1. Profile provisioning
-- ---------------------------------------------------------------------------

-- Every auth user gets a profile row in the same transaction as the signup, so
-- the app never has to cope with a missing profile.
--
-- `profiles.email` is NOT NULL while `auth.users.email` is nullable (phone-only
-- signups). Coalescing matters more than tidiness here: if this trigger raises,
-- the insert into auth.users rolls back and *every* signup fails.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, new.phone, new.id::text),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'buyer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Backfill profiles for any users created before this migration.
insert into public.profiles (id, email, role)
select u.id, coalesce(u.email, u.phone, u.id::text), 'buyer'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- ---------------------------------------------------------------------------
-- 2. Admin predicate
-- ---------------------------------------------------------------------------

-- `security definer` so the check itself isn't subject to the profiles policies
-- it is used to define (which would recurse).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Order columns for Razorpay reconciliation
-- ---------------------------------------------------------------------------

-- 001 reused `stripe_payment_intent_id` for Razorpay ids, which made it
-- impossible to match a webhook to one specific order.
alter table public.orders add column if not exists razorpay_order_id text;
alter table public.orders add column if not exists razorpay_payment_id text;

create unique index if not exists idx_orders_razorpay_order
  on public.orders(razorpay_order_id)
  where razorpay_order_id is not null;

-- ---------------------------------------------------------------------------
-- 4. Row-level security
-- ---------------------------------------------------------------------------

-- profiles: a row carries an email address, so it is not public.
drop policy if exists "Public profile read" on public.profiles;
drop policy if exists "User self update profile" on public.profiles;

create policy "Read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "Update own profile" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- A buyer must not be able to self-promote. Enforced with column privileges
-- rather than inside the policy above: a policy on `profiles` that subselects
-- `profiles` to read the old role recurses. `role` is granted to nobody, so
-- only the service-role key (which bypasses RLS) can change it — that is the
-- path lib/admin.ts syncAdminRole() takes.
revoke update on public.profiles from authenticated;
grant update (full_name, country, avatar_url, updated_at) on public.profiles to authenticated;

-- listings: public catalog, curator-only writes.
drop policy if exists "Public read listings" on public.listings;
drop policy if exists "Public insert listings" on public.listings;
drop policy if exists "Public update listings" on public.listings;

create policy "Public read listings" on public.listings
  for select using (true);

create policy "Admin insert listings" on public.listings
  for insert to authenticated with check (public.is_admin());

create policy "Admin update listings" on public.listings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admin delete listings" on public.listings
  for delete to authenticated using (public.is_admin());

-- listing_images: same shape as listings.
drop policy if exists "Public read images" on public.listing_images;
drop policy if exists "Public insert images" on public.listing_images;

create policy "Public read images" on public.listing_images
  for select using (true);

create policy "Admin insert images" on public.listing_images
  for insert to authenticated with check (public.is_admin());

create policy "Admin update images" on public.listing_images
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admin delete images" on public.listing_images
  for delete to authenticated using (public.is_admin());

-- bids: the ledger stays publicly readable (auction transparency, and bidder_id
-- is an opaque uuid now that profiles are private).
drop policy if exists "Public read bids" on public.bids;
drop policy if exists "Public insert bids" on public.bids;

create policy "Public read bids" on public.bids
  for select using (true);

-- Deliberately no insert policy. Bids may only be written through place_bid(),
-- which is `security definer` and therefore bypasses RLS — that is the single
-- path where the increment tiers, auction window, and bidder identity are all
-- enforced. A direct insert would also fire 001's trigger_update_highest_bid,
-- which updates `listings` with the caller's own privileges and would now be
-- rejected by the admin-only listings update policy.

-- orders: contain shipping addresses. Buyer or curator only.
drop policy if exists "Public read orders" on public.orders;
drop policy if exists "Public insert orders" on public.orders;

create policy "Read own orders" on public.orders
  for select using (buyer_id = auth.uid() or public.is_admin());

create policy "Create own orders" on public.orders
  for insert to authenticated with check (buyer_id = auth.uid());

-- Payment status transitions are made by the webhook with the service-role key,
-- which bypasses RLS. Collectors may not edit an order at all; curators can
-- advance dispatch state.
create policy "Admin update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. Hardened bidding procedure
-- ---------------------------------------------------------------------------

-- 001's place_bid took the bidder id as an argument. Since the function is
-- `security definer`, any caller could record a bid under someone else's id. It
-- also read `current_highest_bid` without locking the row, so two simultaneous
-- bids could both pass the comparison, and it never checked that the auction was
-- open or that the increment was large enough.
drop function if exists public.place_bid(uuid, numeric, uuid);

create or replace function public.place_bid(
  p_listing_id uuid,
  p_amount numeric
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_listing   public.listings;
  v_bidder    uuid := auth.uid();
  v_current   numeric;
  v_min_next  numeric;
  v_bid_id    uuid;
begin
  if v_bidder is null then
    raise exception 'You must be signed in to bid' using errcode = '42501';
  end if;

  -- Lock the listing so concurrent bids serialise on this row.
  select * into v_listing
  from public.listings
  where id = p_listing_id
  for update;

  if not found then
    raise exception 'Listing not found' using errcode = 'P0002';
  end if;

  if v_listing.listing_type <> 'auction' or v_listing.status <> 'active' then
    raise exception 'This listing is not an active auction';
  end if;

  if v_listing.auction_end is not null and v_listing.auction_end <= now() then
    raise exception 'This auction has already ended';
  end if;

  if v_listing.seller_id is not null and v_listing.seller_id = v_bidder then
    raise exception 'You cannot bid on your own listing';
  end if;

  v_current := coalesce(v_listing.current_highest_bid, v_listing.starting_bid, 0);

  -- Tiers mirror getMinimumNextBid() in lib/auction-logic.ts.
  v_min_next := case
    when v_current = 0    then 1.0
    when v_current < 50   then v_current + 2.0
    when v_current < 200  then v_current + 5.0
    when v_current < 1000 then v_current + 25.0
    else v_current + 50.0
  end;

  if p_amount < v_min_next then
    raise exception 'Bid must be at least %', to_char(v_min_next, 'FM999999999.00');
  end if;

  insert into public.bids (listing_id, bidder_id, amount)
  values (p_listing_id, v_bidder, p_amount)
  returning id into v_bid_id;

  update public.listings
  set current_highest_bid = p_amount,
      updated_at = now()
  where id = p_listing_id;

  return jsonb_build_object('success', true, 'bid_id', v_bid_id, 'new_amount', p_amount);
end;
$$;

-- Anonymous visitors cannot bid at all.
revoke all on function public.place_bid(uuid, numeric) from public;
revoke all on function public.place_bid(uuid, numeric) from anon;
grant execute on function public.place_bid(uuid, numeric) to authenticated;

-- Storage lives in 003_storage.sql: creating policies on `storage.objects`
-- requires ownership that the migration role doesn't always have, and a failure
-- there must not roll back the RLS tightening above.
