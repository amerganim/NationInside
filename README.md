# NationInside — Party Operating System (Pitch Demo)

A digital **operating system for political organisations**, built for the Bangladesh
context. This is the **Phase 0 pitch demo**: a fully interactive, projector-ready
web app running entirely on **mock data**, designed so the data layer can be swapped
for a real backend (Supabase/Postgres) in Phase 1 **without a UI rewrite**.

> **Pitch line:** _See your whole party → measure who's real → mobilise them instantly →
> win nominations and elections with data._

## 🌐 Live demo

**Production:** **https://nation-inside.vercel.app**

Hosted free on **Vercel** (global CDN, opens fast on mobile). The best pitch view is the
full-screen **War Room** at [`/warroom`](https://nation-inside.vercel.app/warroom).
All figures are mock data and consistent across every screen.

## Features (all live in this demo)

| Route | Feature | What it shows |
|-------|---------|---------------|
| `/` | **National Dashboard** | 1.25M members, 64-district live map, growth & status charts |
| `/hierarchy` | **Organisation Tree** | Drill National → Division → District → Upazila → Union → Ward |
| `/members` | **Members & Digital ID** | Searchable member directory + QR digital ID cards |
| `/mobilize` | **One-Tap Mobilisation** ⭐ | Press once; a notification cascades down the hierarchy with live responses |
| `/activity` | **Political Activity Score** | A "credit score" for members; leaderboards; "paper member" detector |
| `/nominations` | **Nomination Intelligence** ⭐ | Data-driven candidate scorecards & radar comparison per seat |
| `/assistant` | **AI Assistant** | Scripted Q&A answered from real data + speech generator |
| `/warroom` | **War Room** | Full-screen election-day command center with live-ticking metrics |

## Stack (all free tier)

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Recharts** — charts · **react-leaflet + OpenStreetMap/CARTO** — free maps (no API key)
- **Motion** — animations · **qrcode.react** — QR IDs · **lucide-react** — icons

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Architecture note — built to scale, not to throw away

All data comes from [`src/lib/data.ts`](src/lib/data.ts), a deterministic mock
generator whose TypeScript types **mirror a future Postgres schema**
(`org_nodes`, `members`, …). Every figure is seeded, so the same numbers appear
consistently across every screen.

**Phase 1 swap:** replace the functions in `data.ts` (`getNode`, `getChildren`,
`getMembers`, …) with Supabase queries — the UI components stay untouched.

### Free → paid scaling path

```
Free Supabase  →  Supabase Pro ($25)  →  Self-hosted Postgres (Hetzner VPS)
   (0–5k)            (5k–50k)              + Cloudflare R2 media  (50k–200k+)
```

Postgres throughout (relational, self-hostable) — no vendor lock-in, predictable cost.
Mobile member app (Flutter) is planned for Phase 1; this demo is web-first for pitching.

## Deployment

Hosted on **Vercel** (free tier).

- **Production URL:** https://nation-inside.vercel.app
- **Vercel project:** `doctorschamberhub-6688s-projects/nation-inside`
- **Production branch (intended):** `webdemo`

### Manual deploy (works today)

```bash
npx vercel deploy --prod --yes
```

### Enable push-to-deploy from `webdemo` (one-time setup)

GitHub auto-deploy needs a one-time browser authorization that can't be done from
the CLI. Once completed, every push to `webdemo` deploys automatically.

1. **Authorize GitHub on Vercel:** install/grant the Vercel GitHub App for the
   `NationInside` repo → https://github.com/apps/vercel
2. **Connect the repo:** Vercel dashboard → project `nation-inside` →
   **Settings → Git → Connect Git Repository** → select `amerganim/NationInside`.
3. **Set the production branch:** **Settings → Git → Production Branch** → `webdemo` → Save.

After that:

```bash
git checkout webdemo
git add -A && git commit -m "…"
git push            # Vercel builds & deploys automatically
```

---
_Demo build · all figures are mock data._
