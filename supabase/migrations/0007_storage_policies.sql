-- ============================================================================
-- Storage policies for the public "photos" bucket.
-- A public bucket is publicly READABLE, but uploads still require RLS policies
-- on storage.objects. Without these, client uploads fail with
-- "new row violates row-level security policy".
-- Run in the Supabase SQL Editor.
-- ============================================================================

-- Signed-in members may upload files to the photos bucket.
create policy "photos_authenticated_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'photos');

-- Signed-in members may overwrite (upsert) files in the photos bucket.
create policy "photos_authenticated_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'photos')
  with check (bucket_id = 'photos');

-- Anyone may read files (the bucket is public; make it explicit).
create policy "photos_public_read"
  on storage.objects for select to public
  using (bucket_id = 'photos');
