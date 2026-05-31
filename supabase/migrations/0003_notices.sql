-- ============================================================================
-- Broadcasts / Notices — admins post announcements, members read them.
-- Run in the Supabase SQL Editor after 0001 & 0002.
-- ============================================================================
create table notices (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text,
  pinned       boolean not null default false,
  org_node_id  text references org_nodes(id),
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now()
);

alter table notices enable row level security;

-- Any signed-in member can read notices; writes happen via the service role (admin).
create policy notices_read on notices for select to authenticated using (true);
