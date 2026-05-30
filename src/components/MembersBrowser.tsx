"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, BadgeCheck, ExternalLink } from "lucide-react";
import type { Member } from "@/lib/data";
import { Avatar, Badge, scoreColor } from "@/components/ui";
import DigitalIdCard from "@/components/DigitalIdCard";

type Filter = "all" | "active" | "inactive" | "verified";

export default function MembersBrowser({ members }: { members: Member[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(members[0]?.id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (filter === "active" && m.status !== "active") return false;
      if (filter === "inactive" && m.status !== "inactive") return false;
      if (filter === "verified" && !m.verified) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.districtName.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
      );
    });
  }, [members, query, filter]);

  const selected = members.find((m) => m.id === selectedId) ?? filtered[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* List */}
      <div className="lg:col-span-2 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, district, ID, designation…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0d1626] border border-border text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="flex gap-1 rounded-xl bg-[#0d1626] border border-border p-1">
            {(["all", "active", "inactive", "verified"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                  filter === f ? "bg-[var(--accent)]/20 text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted">{filtered.length} members</div>

        <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                selected?.id === m.id
                  ? "border-[var(--accent)] bg-[var(--accent)]/10"
                  : "border-border bg-[#0d1626] hover:bg-[#101c33]"
              }`}
            >
              <Avatar initials={m.initials} hue={m.hue} size={40} />
              <div className="min-w-0 flex-1">
                <div className="font-medium flex items-center gap-1.5 truncate">
                  {m.name}
                  {m.verified && <BadgeCheck size={14} className="text-[var(--accent)] shrink-0" />}
                </div>
                <div className="text-xs text-muted truncate">
                  {m.designation} · {m.districtName}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold tabular-nums" style={{ color: scoreColor(m.activityScore) }}>
                  {m.activityScore}
                </div>
                <Badge color={m.status === "active" ? "var(--accent)" : "var(--muted)"}>{m.status}</Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected ID */}
      <div className="lg:sticky lg:top-24 self-start flex flex-col items-center gap-4">
        {selected && (
          <>
            <DigitalIdCard member={selected} />
            <Link
              href={`/members/${selected.id}`}
              className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
            >
              Open full ID page <ExternalLink size={14} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
