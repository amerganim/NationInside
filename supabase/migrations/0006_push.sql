-- ============================================================================
-- Web Push subscriptions — store each member's browser push endpoint.
-- Run in the Supabase SQL Editor after 0001-0005.
-- ============================================================================
create table push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  member_id    uuid references profiles(id) on delete cascade,
  endpoint     text not null unique,
  p256dh       text not null,
  auth         text not null,
  org_node_id  text,                       -- denormalized at subscribe time, for targeting
  created_at   timestamptz not null default now()
);
create index push_subscriptions_member_idx on push_subscriptions(member_id);

alter table push_subscriptions enable row level security;

-- A member manages only their own subscriptions; the server (service role) reads all to send.
create policy push_select_own on push_subscriptions for select to authenticated using (member_id = auth.uid());
create policy push_insert_own on push_subscriptions for insert to authenticated with check (member_id = auth.uid());
create policy push_delete_own on push_subscriptions for delete to authenticated using (member_id = auth.uid());
