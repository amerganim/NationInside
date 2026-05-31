import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth/session";
import { searchMembers } from "@/lib/insights/search";
import { Panel, Badge, Avatar, scoreColor } from "@/components/ui";
import { rankFor } from "@/lib/gamification";

export const dynamic = "force-dynamic";

const EXAMPLES = [
  "inactive members in Gazipur",
  "volunteers in Dhaka",
  "pending members",
  "youth coordinators",
];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { profile } = await getSession();
  if (!isAdmin(profile)) redirect("/app");

  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const res = query ? await searchMembers(query) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles size={20} className="text-[var(--accent)]" /> Smart Search</h1>
        <p className="text-muted mt-1">Ask in plain language — e.g. “inactive members in Gazipur”.</p>
      </div>

      <form method="GET" className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          name="q"
          defaultValue={query}
          autoFocus
          placeholder="Search members by district, status, role…"
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0d1626] border border-border outline-none focus:border-[var(--accent)]"
        />
      </form>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <Link key={e} href={`/app/search?q=${encodeURIComponent(e)}`}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground hover:border-[var(--accent)] transition-colors">
            {e}
          </Link>
        ))}
      </div>

      {res && (
        <Panel
          title={`${res.results.length} result${res.results.length === 1 ? "" : "s"}`}
          subtitle={res.interpreted.length ? undefined : "No filters detected — searched by name"}
          action={
            <div className="flex flex-wrap gap-1.5 justify-end">
              {res.interpreted.map((i) => <Badge key={i} color="var(--accent-2)">{i}</Badge>)}
            </div>
          }
        >
          {res.results.length === 0 ? (
            <p className="text-sm text-muted py-8 text-center">No matching members.</p>
          ) : (
            <ul className="divide-y divide-border">
              {res.results.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-3">
                  <Avatar initials={(m.name.split(" ").map((w) => w[0]).slice(0, 2).join("") || "M").toUpperCase()} hue={200} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-xs text-muted truncate">{m.designation} · {m.district}</div>
                  </div>
                  <span className="text-xs capitalize text-muted hidden sm:block">{m.status}</span>
                  <span className="text-xs" style={{ color: rankFor(m.score).color }}>{rankFor(m.score).name}</span>
                  <span className="text-sm font-bold tabular-nums w-8 text-right" style={{ color: scoreColor(m.score) }}>{m.score}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}
    </div>
  );
}
