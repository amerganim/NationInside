"use client";

import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import type { MapPoint } from "@/components/MapBangladesh";
import { GrowthPoint, fmtCompact, fmt } from "@/lib/data";
import { Panel } from "@/components/ui";

const MapBangladesh = dynamic(() => import("@/components/MapBangladesh"), {
  ssr: false,
  loading: () => (
    <div className="grid place-items-center h-[460px] text-muted text-sm">Loading map…</div>
  ),
});

const AXIS = "#8ea0c2";
const GRID = "#243150";

/** Renders children only after mount so Recharts has a measurable container. */
function Chart({ h, children }: { h: number; children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div style={{ height: h }}>
      {mounted ? children : <div className="w-full h-full animate-pulse rounded-lg bg-white/5" />}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color || p.fill }}>
          {p.name}: <b>{fmt(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

export default function DashboardClient({
  mapPoints,
  growth,
  statusData,
  topDistricts,
}: {
  mapPoints: MapPoint[];
  growth: GrowthPoint[];
  statusData: { name: string; value: number; color: string }[];
  topDistricts: { name: string; members: number }[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Map */}
      <Panel
        className="lg:col-span-2"
        title="National Coverage"
        subtitle="64 districts · marker size = members · colour = organisational health"
      >
        <MapBangladesh points={mapPoints} />
        <div className="flex items-center gap-4 mt-3 text-xs text-muted">
          <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-full inline-block" style={{ background: "var(--accent)" }} /> Strong (70+)</span>
          <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-full inline-block" style={{ background: "var(--warn)" }} /> Moderate (50–69)</span>
          <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-full inline-block" style={{ background: "var(--danger)" }} /> Needs attention (&lt;50)</span>
        </div>
      </Panel>

      {/* Status donut */}
      <Panel title="Member Status" subtitle="Active vs inactive nationwide">
        <Chart h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                strokeWidth={0}
              >
                {statusData.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>
        <div className="space-y-2 mt-2">
          {statusData.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted">
                <i className="w-3 h-3 rounded-sm inline-block" style={{ background: s.color }} />
                {s.name}
              </span>
              <span className="font-semibold tabular-nums">{fmt(s.value)}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Growth */}
      <Panel
        className="lg:col-span-2"
        title="Membership Growth"
        subtitle="Last 12 months"
      >
        <Chart h={260}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growth} margin={{ left: -10, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16c784" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#16c784" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2f80ed" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#2f80ed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke={AXIS} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis stroke={AXIS} tick={{ fontSize: 12 }} tickFormatter={fmtCompact} tickLine={false} axisLine={false} width={48} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="members" name="Members" stroke="#16c784" strokeWidth={2} fill="url(#gMembers)" />
              <Area type="monotone" dataKey="volunteers" name="Volunteers" stroke="#2f80ed" strokeWidth={2} fill="url(#gVol)" />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>
      </Panel>

      {/* Top districts */}
      <Panel title="Top Districts" subtitle="By total membership">
        <Chart h={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topDistricts} layout="vertical" margin={{ left: 18, right: 16 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke={AXIS} tick={{ fontSize: 11 }} tickFormatter={fmtCompact} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke={AXIS} tick={{ fontSize: 12 }} width={90} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#ffffff08" }} />
              <Bar dataKey="members" name="Members" fill="#16c784" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Panel>
    </div>
  );
}
