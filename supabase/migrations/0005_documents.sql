-- ============================================================================
-- Document sharing — party constitution, circulars, notices (files).
-- Files are stored in the existing public "photos" bucket under documents/.
-- Run in the Supabase SQL Editor after 0001-0004.
-- ============================================================================
create table documents (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  file_url     text not null,
  file_name    text,
  file_type    text,
  org_node_id  text references org_nodes(id),
  uploaded_by  uuid references auth.users(id),
  created_at   timestamptz not null default now()
);

alter table documents enable row level security;

-- Any signed-in member can read/download documents; uploads via service role (admin).
create policy documents_read on documents for select to authenticated using (true);
