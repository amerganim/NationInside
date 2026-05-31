-- ============================================================================
-- NationInside — Phase 1 pilot schema
-- Postgres (Supabase). Apply via Supabase SQL Editor or `supabase db push`.
--
-- Authorization model (pilot):
--   * Member self-service (own rows) → anon key + Row Level Security below.
--   * Privileged/aggregate reads & admin writes → Next.js server actions using
--     the SERVICE ROLE key (server-only), with authorization enforced in code.
-- ============================================================================

-- ---------- Enums ----------
create type user_role        as enum ('member', 'admin', 'super_admin');
create type member_status    as enum ('pending', 'active', 'suspended');
create type org_level        as enum ('national','division','district','upazila','union','ward');
create type task_category     as enum ('relief','plantation','blood','rally','survey','recruitment','other');
create type assignment_status as enum ('assigned','in_progress','submitted','approved','rejected');
create type mobil_response    as enum ('coming','enroute','declined');

-- ---------- Organisation tree ----------
create table org_nodes (
  id          text primary key,                 -- slug id, e.g. 'national/dhaka/gazipur'
  parent_id   text references org_nodes(id) on delete cascade,
  level       org_level not null,
  name        text not null,
  name_bn     text,
  path        text not null,                     -- materialized path = id, for subtree LIKE queries
  lat         double precision,
  lng         double precision,
  created_at  timestamptz not null default now()
);
create index org_nodes_parent_idx on org_nodes(parent_id);
create index org_nodes_path_idx   on org_nodes(path text_pattern_ops);

-- ---------- Member profiles (1:1 with auth.users) ----------
create table profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  full_name      text not null default '',
  name_bn        text,
  phone          text,
  photo_url      text,
  designation    text not null default 'Member',
  org_node_id    text references org_nodes(id),
  role           user_role     not null default 'member',
  status         member_status not null default 'pending',
  activity_score int           not null default 0,
  joined_at      timestamptz   not null default now(),
  verified_by    uuid references auth.users(id),
  verified_at    timestamptz
);
create index profiles_org_idx    on profiles(org_node_id);
create index profiles_status_idx on profiles(status);

-- ---------- Events + attendance ----------
create table events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  org_node_id   text references org_nodes(id),
  location      text,
  lat           double precision,
  lng           double precision,
  starts_at     timestamptz not null,
  ends_at       timestamptz,
  expected      int default 0,
  qr_token      text not null default encode(gen_random_bytes(8), 'hex'),
  created_by    uuid references auth.users(id),
  created_at    timestamptz not null default now()
);

create table event_attendance (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references events(id) on delete cascade,
  member_id   uuid not null references profiles(id) on delete cascade,
  method      text not null default 'qr',
  lat         double precision,
  lng         double precision,
  checked_in_at timestamptz not null default now(),
  unique (event_id, member_id)
);

-- ---------- Tasks / missions + assignments ----------
create table tasks (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  category     task_category not null default 'other',
  org_node_id  text references org_nodes(id),
  points       int not null default 10,
  due_at       timestamptz,
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now()
);

create table task_assignments (
  id            uuid primary key default gen_random_uuid(),
  task_id       uuid not null references tasks(id) on delete cascade,
  member_id     uuid not null references profiles(id) on delete cascade,
  status        assignment_status not null default 'assigned',
  note          text,
  photo_url     text,
  lat           double precision,
  lng           double precision,
  submitted_at  timestamptz,
  reviewed_by   uuid references auth.users(id),
  points_awarded int not null default 0,
  created_at    timestamptz not null default now(),
  unique (task_id, member_id)
);

-- ---------- Mobilisation + live responses ----------
create table mobilizations (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  org_node_id  text references org_nodes(id),
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now()
);

create table mobilization_responses (
  id               uuid primary key default gen_random_uuid(),
  mobilization_id  uuid not null references mobilizations(id) on delete cascade,
  member_id        uuid not null references profiles(id) on delete cascade,
  response         mobil_response not null default 'coming',
  lat              double precision,
  lng              double precision,
  responded_at     timestamptz not null default now(),
  unique (mobilization_id, member_id)
);

-- ---------- Score ledger (drives activity_score) ----------
create table score_events (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references profiles(id) on delete cascade,
  source      text not null,            -- 'attendance' | 'task' | 'recruitment' | 'manual'
  points      int  not null,
  ref_id      uuid,
  created_at  timestamptz not null default now()
);
create index score_events_member_idx on score_events(member_id);

-- ============================================================================
-- Functions & triggers
-- ============================================================================

-- Auto-create a pending profile when a new auth user signs up.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Recompute activity_score from the score ledger whenever it changes.
create or replace function recompute_activity_score()
returns trigger language plpgsql security definer set search_path = public as $$
declare mid uuid;
begin
  mid := coalesce(new.member_id, old.member_id);
  update public.profiles
     set activity_score = least(100, coalesce((
       select sum(points) from public.score_events where member_id = mid
     ), 0))
   where id = mid;
  return null;
end;
$$;
create trigger score_events_recompute
  after insert or update or delete on score_events
  for each row execute function recompute_activity_score();

-- Prevent members from escalating their own role/status/org/score.
create or replace function prevent_profile_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Privileged DB roles (service-role API requests, SQL editor, admin) may change anything.
  if current_user in ('service_role', 'postgres', 'supabase_admin') then
    return new;
  end if;
  if new.role <> old.role
     or new.status <> old.status
     or new.org_node_id is distinct from old.org_node_id
     or new.activity_score <> old.activity_score
     or new.verified_by is distinct from old.verified_by then
    raise exception 'Not allowed to modify privileged profile fields';
  end if;
  return new;
end;
$$;
create trigger profiles_no_escalation
  before update on profiles
  for each row execute function prevent_profile_escalation();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles               enable row level security;
alter table org_nodes              enable row level security;
alter table events                 enable row level security;
alter table event_attendance       enable row level security;
alter table tasks                  enable row level security;
alter table task_assignments       enable row level security;
alter table mobilizations          enable row level security;
alter table mobilization_responses enable row level security;
alter table score_events           enable row level security;

-- org_nodes: readable by any signed-in user; writes only via service role.
create policy org_read on org_nodes for select to authenticated using (true);

-- profiles: read & edit own row only (other reads happen via service role).
create policy profiles_select_own on profiles for select to authenticated using (auth.uid() = id);
create policy profiles_update_own on profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- events / tasks / mobilizations: readable by all signed-in users.
create policy events_read       on events       for select to authenticated using (true);
create policy tasks_read        on tasks        for select to authenticated using (true);
create policy mobil_read        on mobilizations for select to authenticated using (true);

-- attendance: a member sees & creates only their own check-ins.
create policy att_select_own on event_attendance for select to authenticated using (auth.uid() = member_id);
create policy att_insert_own on event_attendance for insert to authenticated with check (auth.uid() = member_id);

-- task assignments: member sees & updates their own.
create policy ta_select_own on task_assignments for select to authenticated using (auth.uid() = member_id);
create policy ta_update_own on task_assignments for update to authenticated using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- mobilisation responses: everyone signed-in can read live counts; write own.
create policy mr_select on mobilization_responses for select to authenticated using (true);
create policy mr_insert_own on mobilization_responses for insert to authenticated with check (auth.uid() = member_id);
create policy mr_update_own on mobilization_responses for update to authenticated using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- score events: member reads own.
create policy se_select_own on score_events for select to authenticated using (auth.uid() = member_id);

-- ============================================================================
-- Seed: Bangladesh organisation tree (national + 8 divisions + 64 districts)
-- ============================================================================
do $$
declare
  divs jsonb := '[
    {"slug":"dhaka","name":"Dhaka","bn":"ঢাকা","lat":23.81,"lng":90.41,
     "d":["Dhaka","Gazipur","Narayanganj","Tangail","Narsingdi","Munshiganj","Manikganj","Kishoreganj","Faridpur","Gopalganj","Madaripur","Rajbari","Shariatpur"]},
    {"slug":"chattogram","name":"Chattogram","bn":"চট্টগ্রাম","lat":22.35,"lng":91.83,
     "d":["Chattogram","Cox''s Bazar","Cumilla","Brahmanbaria","Chandpur","Feni","Noakhali","Lakshmipur","Khagrachhari","Rangamati","Bandarban"]},
    {"slug":"khulna","name":"Khulna","bn":"খুলনা","lat":22.85,"lng":89.54,
     "d":["Khulna","Jashore","Satkhira","Bagerhat","Jhenaidah","Magura","Narail","Kushtia","Chuadanga","Meherpur"]},
    {"slug":"rajshahi","name":"Rajshahi","bn":"রাজশাহী","lat":24.37,"lng":88.60,
     "d":["Rajshahi","Natore","Naogaon","Chapainawabganj","Pabna","Bogura","Joypurhat","Sirajganj"]},
    {"slug":"barishal","name":"Barishal","bn":"বরিশাল","lat":22.70,"lng":90.37,
     "d":["Barishal","Patuakhali","Bhola","Pirojpur","Barguna","Jhalokati"]},
    {"slug":"sylhet","name":"Sylhet","bn":"সিলেট","lat":24.90,"lng":91.87,
     "d":["Sylhet","Moulvibazar","Habiganj","Sunamganj"]},
    {"slug":"rangpur","name":"Rangpur","bn":"রংপুর","lat":25.74,"lng":89.27,
     "d":["Rangpur","Dinajpur","Kurigram","Gaibandha","Nilphamari","Panchagarh","Thakurgaon","Lalmonirhat"]},
    {"slug":"mymensingh","name":"Mymensingh","bn":"ময়মনসিংহ","lat":24.75,"lng":90.40,
     "d":["Mymensingh","Jamalpur","Netrokona","Sherpur"]}
  ]'::jsonb;
  dv jsonb; dist text; dslug text; divid text; distid text; i int;
begin
  insert into org_nodes (id, parent_id, level, name, name_bn, path, lat, lng)
  values ('national', null, 'national', 'National Committee', 'জাতীয় কমিটি', 'national', 23.80, 90.35);

  for dv in select * from jsonb_array_elements(divs) loop
    divid := 'national/' || (dv->>'slug');
    insert into org_nodes (id, parent_id, level, name, name_bn, path, lat, lng)
    values (divid, 'national', 'division', dv->>'name', dv->>'bn', divid,
            (dv->>'lat')::float, (dv->>'lng')::float);

    i := 0;
    for dist in select jsonb_array_elements_text(dv->'d') loop
      dslug := lower(regexp_replace(dist, '[^a-zA-Z0-9]+', '-', 'g'));
      distid := divid || '/' || dslug;
      insert into org_nodes (id, parent_id, level, name, path, lat, lng)
      values (distid, divid, 'district', dist, distid,
              (dv->>'lat')::float + (random()-0.5)*0.9,
              (dv->>'lng')::float + (random()-0.5)*0.9);
      i := i + 1;
    end loop;
  end loop;
end $$;
