"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

function Chart({ h, children }: { h: number; children: ReactNode }) {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return <div style={{ height: h }}>{m ? children : <div className="w-full h-full animate-pulse rounded-lg bg-white/5" />}</div>;
}

function TT({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      {label && <div className="font-semibold mb-1">{label}</div>}
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color || p.fill }}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
}

export function StatusDonut({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <Chart h={210}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
            {data.map((s) => <Cell key={s.name} fill={s.color} />)}
          </Pie>
          <Tooltip content={<TT />} />
        </PieChart>
      </ResponsiveContainer>
    </Chart>
  );
}

export function DistrictsBar({ data }: { data: { name: string; members: number }[] }) {
  if (!data.length) return <p className="text-sm text-muted py-10 text-center">No active members assigned to districts yet.</p>;
  return (
    <Chart h={240}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 18, right: 16 }}>
          <CartesianGrid stroke="#243150" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" stroke="#8ea0c2" tick={{ fontSize: 11 }} allowDecimals={false} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" stroke="#8ea0c2" tick={{ fontSize: 12 }} width={90} tickLine={false} axisLine={false} />
          <Tooltip content={<TT />} cursor={{ fill: "#ffffff08" }} />
          <Bar dataKey="members" name="Members" fill="#16c784" radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </Chart>
  );
}
