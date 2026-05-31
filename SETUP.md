# NationInside — Pilot Backend Setup (free tier)

This connects the app to a real **Supabase** backend (Postgres + Auth + Storage +
Realtime). One-time, ~10 minutes. Everything here is on the **free tier**.

## 1. Create a free Supabase project
1. Go to **https://supabase.com** → sign in (GitHub login is easiest).
2. **New project** → name it `nationinside` → choose a strong DB password
   (save it) → region **Singapore** (closest to Bangladesh) → **Create**.
3. Wait ~2 minutes for it to provision.

## 2. Apply the database schema
1. In the project: **SQL Editor → New query**.
2. Open [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql),
   copy the whole file, paste it, and click **Run**.
3. You should see "Success". This creates all tables, security policies, and seeds
   the Bangladesh org tree (national + 8 divisions + 64 districts).

## 3. Get your API keys
**Project Settings → API**, copy these into a new file `.env.local` in the repo root
(use [`.env.local.example`](.env.local.example) as the template):

| Env var | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project API keys → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project API keys → `service_role` (keep secret!) |

## 4. Turn off email confirmation (pilot)
**Authentication → Providers → Email** → disable **"Confirm email"** → Save.
(We verify members by **admin approval** in-app, so no email delivery is needed.)

## 5. Create a storage bucket for photos
**Storage → New bucket** → name `photos` → **Public** → Create.
(Member photos, task proof, geo-tagged uploads. 1 GB free.)

## 6. Make yourself the first admin
After you register your own account in the app (step 7), run this in **SQL Editor**
to promote it to super admin (replace the email):

```sql
update profiles set role = 'super_admin', status = 'active', org_node_id = 'national'
where id = (select id from auth.users where email = 'YOUR-EMAIL@example.com');
```

## 7. Run the app
```bash
npm install
npm run dev   # http://localhost:3000
```

Register an account, promote it (step 6), then approve other members from the admin
area. Done — you have a real, multi-user pilot.

---

### Free-tier notes
- Free Postgres **pauses after 7 days of zero activity** — fine for an active pilot;
  a daily ping keeps it warm.
- Storage 1 GB is the first ceiling (photos). We compress on upload; move to
  Cloudflare R2 (10 GB free) when needed.
- Scale path: Supabase Pro ($25/mo) → self-hosted Postgres. No rewrite.
