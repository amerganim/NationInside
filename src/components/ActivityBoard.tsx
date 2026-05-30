"use client";

import { useState } from "react";
import Link from "next/link";
import { Medal, AlertTriangle, CalendarCheck, Target, UserPlus } from "lucide-react";
import type { Member, OrgNode } from "@/lib/data";
import { fmt } from "@/lib/data";
import { Avatar, ScoreBar, Badge, scoreColor } from "@/components/ui";

const MEDAL = ["#ffd24a", "#c7d0dd", "#d8915b"];

export default function ActivityBoard({
  members,
  districts,
}: {
  members: Member[];
  districts: OrgNode[];
}) {
  const [tab, setTab] = useState<"members" | "districts">("members");
  const needAttention = districts.filter((d) => d.activityScore < 50);

  return (
    <div className="space-y-5">
      <div className="flex gap-1 rounded-xl bg-[#0d1626] border border-border p-1 w-fit">
        {(["members", "districts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
              tab === t ? "bg-[var(--accent)]/20 text-foreground font-medium" : "text-muted hover:text-foreground"
            }`}
          >
            {t === "members" ? "Top Volunteers" : "District Rankings"}
          </button>
        ))}
      </div>

      {tab === "members" ? (
        <div className="space-y-2">
          {members.map((m, i) => (
            <Link
              key={m.id}
              href={`/members/${m.id}`}
              className="flex items-center gap-4 p-3 rounded-xl border border-border bg-[#0d1626] hover:bg-[#101c33] transition-colors"
            >
              <div className="w-8 text-center font-bold shrink-0" style={{ color: i < 3 ? MEDAL[i] : "var(--muted)" }}>
                {i < 3 ? <Medal size={20} className="mx-auto" /> : i + 1}
              </div>
              <Avatar initials={m.initials} hue={m.hue} size={42} />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{m.name}</div>
                <div className="text-xs text-muted truncate">{m.designation} · {m.districtName}</div>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1"><CalendarCheck size={13} /> {m.attendance}</span>
                <span className="flex items-center gap-1"><Target size={13} /> {m.missions}</span>
                <span className="flex items-center gap-1"><UserPlus size={13} /> {m.recruits}</span>
              </div>
              <div className="w-28 shrink-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Score</span>
                  <span className="font-bold" style={{ color: scoreColor(m.activityScore) }}>{m.activityScore}</span>
                </div>
                <ScoreBar score={m.activityScore} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {districts.map((d, i) => (
            <div key={d.id} className="flex items-center gap-4 p-3 rounded-xl border border-border bg-[#0d1626]">
              <div className="w-8 text-center font-bold shrink-0" style={{ color: i < 3 ? MEDAL[i] : "var(--muted)" }}>
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-muted">{fmt(d.memberCount)} members · {fmt(d.volunteerCount)} volunteers</div>
              </div>
              {d.activityScore < 50 && (
                <Badge color="var(--danger)"><AlertTriangle size={11} /> Attention</Badge>
              )}
              <div className="w-32 shrink-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Health</span>
                  <span className="font-bold" style={{ color: scoreColor(d.activityScore) }}>{d.activityScore}</span>
                </div>
                <ScoreBar score={d.activityScore} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
