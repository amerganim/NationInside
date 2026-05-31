-- ============================================================================
-- Citizen complaints — members report local issues; admins track resolution.
-- Run in the Supabase SQL Editor after 0001-0003.
-- ============================================================================
create type complaint_status as enum ('submitted','assigned','in_progress','solved','rejected');

create table complaints (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  category      text not null default 'other',  -- road | water | electricity | sanitation | safety | other
  photo_url     text,
  location      text,
  lat           double precision,
  lng           double precision,
  status        complaint_status not null default 'submitted',
  org_node_id   text references org_nodes(id),
  submitted_by  uuid references profiles(id) on delete set null,
  assigned_to   uuid references profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index complaints_status_idx on complaints(status);

alter table complaints enable row level security;

-- Community visibility: any signed-in member can read complaints.
create policy complaints_read on complaints for select to authenticated using (true);
-- A member may file a complaint as themselves.
create policy complaints_insert on complaints
  for insert to authenticated with check (submitted_by = auth.uid());
-- Status changes / assignment happen via the service role (admin server actions).
