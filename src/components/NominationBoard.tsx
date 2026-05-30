"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { Vote, Crown } from "lucide-react";
import type { Constituency } from "@/lib/data";
import { fmt } from "@/lib/data";
import { Avatar, Badge, ScoreBar, scoreColor } from "@/components/ui";
import { Panel } from "@/components/ui";

const CAND_COLORS = ["#16c784", "#2f80ed", "#f5a524"];
const METRICS: { key: keyof Constituency["contenders"][0]["metrics"]; label: string }[] = [
  { key: "network", label: "Ground Network" },
  { key: "activity", label: "Member Activity" },
  { key: "events", label: "Events Run" },
  { key: "complaints", label: "Complaints Solved" },
  { key: "popularity", label: "Popularity" },
];

function Mounted({ h, children }: { h: number; children: ReactNode }) {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return <div style={{ height: h }}>{m ? children : <div className="w-full h-full animate-pulse rounded-lg bg-white/5" />}</div>;
}

export default function NominationBoard({ constituencies }: { constituencies: Constituency[] }) {
  const [seatId, setSeatId] = useState(constituencies[0].id);
  const seat = constituencies.find((c) => c.id === seatId)!;

  const radarData = METRICS.map((m) => {
    const row: Record<string, string | number> = { metric: m.label };
    seat.contenders.forEach((c) => (row[c.name] = c.metrics[m.key]));
    return row;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Seat list */}
      <Panel title="Constituencies" subtitle="Select a seat to compare contenders" className="self-start">
        <div className="space-y-2">
          {constituencies.map((c) => {
            const lead = c.contenders[0];
            return (
              <button
                key={c.id}
                onClick={() => setSeatId(c.id)}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  seatId === c.id ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-border bg-[#0d1626] hover:bg-[#101c33]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-2"><Vote size={15} className="text-muted" /> {c.seat}</span>
                  <span className="text-xs text-muted">{c.contenders.length} contenders</span>
                </div>
                <div className="text-xs text-muted mt-1 flex items-center gap-1">
                  <Crown size={12} className="text-[var(--warn)]" /> Leading: {lead.name} ({lead.score})
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      {/* Comparison */}
      <div className="lg:col-span-2 space-y-5">
        <Panel
          title={`${seat.seat} — Candidate Comparison`}
          subtitle={`Electorate ≈ ${fmt(seat.electorate)} · data-driven nomination scoring`}
        >
          <Mounted h={300}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="#243150" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#8ea0c2", fontSize: 11 }} />
                {seat.contenders.map((c, i) => (
                  <Radar
                    key={c.id}
                    name={c.name}
                    dataKey={c.name}
                    stroke={CAND_COLORS[i]}
                    fill={CAND_COLORS[i]}
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "#111a2e", border: "1px solid #243150", borderRadius: 10, fontSize: 12 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Mounted>
        </Panel>

        <div className="grid sm:grid-cols-2 gap-4">
          {seat.contenders.map((c, i) => (
            <div
              key={c.id}
              className={`panel p-5 relative ${c.recommended ? "ring-1 ring-[var(--accent)]" : ""}`}
            >
              {c.recommended && (
                <div className="absolute top-3 right-3">
                  <Badge color="var(--accent)"><Crown size={12} /> Recommended</Badge>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Avatar initials={c.initials} hue={c.hue} size={48} />
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <i className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: CAND_COLORS[i] }} />
                    {c.name}
                  </div>
                  <div className="text-xs text-muted">{c.designation} · age {c.age}</div>
                </div>
              </div>

              <div className="flex items-end justify-between mt-4">
                <span className="text-xs text-muted">Nomination score</span>
                <span className="text-3xl font-bold" style={{ color: scoreColor(c.score) }}>{c.score}</span>
              </div>
              <ScoreBar score={c.score} />

              <div className="mt-4 space-y-1.5">
                {METRICS.map((m) => (
                  <div key={m.key} className="flex items-center justify-between text-xs">
                    <span className="text-muted">{m.label}</span>
                    <span className="font-medium tabular-nums">{c.metrics[m.key]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
