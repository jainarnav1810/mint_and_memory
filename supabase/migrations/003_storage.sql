-- 003_storage.sql
-- The `listing-images` bucket: public read, curator-only write.
--
-- Split out from 002 deliberately. `storage.objects` is owned by
-- `supabase_storage_admin`, and depending on how the project was provisioned the
-- migration role may not be able to create policies on it — the failure is
-- `42501: must be owner of table objects`. Because `supabase db push` runs each
-- file in its own transaction, keeping this separate means such a failure cannot
-- roll back the RLS tightening in 002.
--
-- If this file does fail, apply the equivalent through the dashboard:
--   Storage → New bucket → name `listing-images`, Public bucket → on
--   Storage → Policies → storage.objects → add the four rules below.

-- The bucket itself. `storage.buckets` is writable by the migration role, so
-- this half succeeds even where the policies below don't.
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read listing images" on storage.objects;
drop policy if exists "Admin upload listing images" on storage.objects;
drop policy if exists "Admin update listing images" on storage.objects;
drop policy if exists "Admin delete listing images" on storage.objects;

-- Read is open: catalogue photographs are meant to be seen, and the bucket is
-- public so `resolveImageUrl()` can build a plain object URL without signing.
create policy "Public read listing images" on storage.objects
  for select using (bucket_id = 'listing-images');

-- Writes are curator-only. components/image-uploader.tsx uploads straight from
-- the browser with the anon key, so this policy is the only thing standing
-- between a signed-in buyer and write access to the bucket.
create policy "Admin upload listing images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'listing-images' and public.is_admin());

create policy "Admin update listing images" on storage.objects
  for update to authenticated
  using (bucket_id = 'listing-images' and public.is_admin());

create policy "Admin delete listing images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'listing-images' and public.is_admin());
