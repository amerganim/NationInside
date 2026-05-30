"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Users,
  CalendarRange,
  ShieldAlert,
  Navigation,
  Radio,
  TriangleAlert,
  CheckCircle2,
} from "lucide-react";
import type { MapPoint } from "@/components/MapBangladesh";
import { fmt } from "@/lib/data";

const MapBangladesh = dynamic(() => import("@/components/MapBangladesh"), {
  ssr: false,
  loading: () => <div className="grid place-items-center h-full text-muted text-sm">Loading map…</div>,
});

const INCIDENTS = [
  { kind: "ok", text: "Polling agents deployed", where: "Gazipur-2" },
  { kind: "up", text: "High turnout reported", where: "Dhaka-7" },
  { kind: "warn", text: "Volunteer shortage flagged", where: "Khulna ward 4" },
  { kind: "ok", text: "Bus convoy departed", where: "Sylhet-1" },
  { kind: "warn", text: "Slow queue reported", where: "Cumilla-5" },
  { kind: "ok", text: "Relief team mobilised", where: "Rangpur-3" },
  { kind: "up", text: "Turnout crossed 60%", where: "Bogura-6" },
  { kind: "ok", text: "Centre secured", where: "Chattogram-10" },
];

function useClock() {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-GB"));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function WarRoomClient({
  mapPoints,
  turnout,
}: {
  mapPoints: MapPoint[];
  turnout: { name: string; pct: number }[];
}) {
  const clock = useClock();
  const [mobilised, setMobilised] = useState(842_000);
  const [onGround, setOnGround] = useState(126_400);
  const [events] = useState(120);
  const [incidents, setIncidents] = useState(7);
  const [feed, setFeed] = useState(
    INCIDENTS.slice(0, 5).map((x, i) => ({ ...x, id: i, time: "now" })),
  );
  const feedId = useRef(100);

  // Live ticking
  useEffect(() => {
    const id = setInterval(() => {
      setMobilised((v) => v + Math.floor(Math.random() * 900));
      setOnGround((v) => v + Math.floor(Math.random() * 220));
      if (Math.random() < 0.35) setIncidents((v) => v + (Math.random() < 0.5 ? 1 : 0));
      if (Math.random() < 0.6) {
        const item = INCIDENTS[Math.floor(Math.random() * INCIDENTS.length)];
        setFeed((f) => [{ ...item, id: feedId.current++, time: "just now" }, ...f].slice(0, 9));
      }
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#070b14]">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted hover:text-foreground flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Exit
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-bold tracking-wide text-lg flex items-center gap-2">
            <Radio size={18} className="text-[var(--bd-red)]" /> NATIONAL WAR ROOM
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bd-red)]/20 text-[var(--bd-red)] font-semibold">
            ELECTION DAY · LIVE
          </span>
        </div>
        <div className="font-mono text-lg tabular-nums">{clock}</div>
      </header>

      {/* Metric strip */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4">
        <Metric icon={<Users size={18} />} label="Members Mobilised" value={fmt(mobilised)} color="var(--accent)" />
        <Metric icon={<Navigation size={18} />} label="On the Ground" value={fmt(onGround)} color="var(--accent-2)" />
        <Metric icon={<CalendarRange size={18} />} label="Active Operations" value={fmt(events)} color="var(--warn)" />
        <Metric icon={<ShieldAlert size={18} />} label="Open Incidents" value={fmt(incidents)} color="var(--bd-red)" />
      </div>

      {/* Body */}
      <div className="flex-1 grid grid-cols-12 gap-4 px-6 pb-6 min-h-0">
        {/* Map */}
        <div className="col-span-7 panel p-3 min-h-0">
          <div className="text-xs text-muted px-2 pb-2 flex items-center justify-between">
            <span>LIVE COVERAGE · marker size = mobilisation</span>
            <span className="flex items-center gap-1"><span className="live-dot" /> realtime</span>
          </div>
          <div className="h-[calc(100%-28px)]">
            <MapBangladesh points={mapPoints} height="100%" />
          </div>
        </div>

        {/* Turnout */}
        <div className="col-span-2 panel p-4 min-h-0 overflow-y-auto">
          <div className="text-xs text-muted mb-3">TURNOUT BY SEAT</div>
          <div className="space-y-3">
            {turnout.map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{d.name}</span>
                  <span className="font-semibold tabular-nums">{d.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#0c1424] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: d.pct > 60 ? "var(--accent)" : d.pct > 45 ? "var(--warn)" : "var(--bd-red)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${d.pct}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident feed */}
        <div className="col-span-3 panel p-4 min-h-0 flex flex-col">
          <div className="text-xs text-muted mb-3 flex items-center justify-between">
            <span>INCIDENT &amp; FIELD FEED</span>
            <span className="live-dot" />
          </div>
          <div className="flex-1 overflow-hidden space-y-2">
            <AnimatePresence initial={false}>
              {feed.map((f) => {
                const Icon = f.kind === "warn" ? TriangleAlert : f.kind === "up" ? Navigation : CheckCircle2;
                const color = f.kind === "warn" ? "var(--bd-red)" : f.kind === "up" ? "var(--accent-2)" : "var(--accent)";
                return (
                  <motion.div
                    key={f.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 p-2 rounded-lg bg-[#0d1626]"
                  >
                    <Icon size={15} style={{ color }} className="mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm leading-tight">{f.text}</div>
                      <div className="text-[11px] text-muted">{f.where} · {f.time}</div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="panel p-4 flex items-center gap-4">
      <span className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: `${color}22`, color }}>
        {icon}
      </span>
      <div>
        <div className="text-xs text-muted uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-bold tabular-nums" style={{ color }}>{value}</div>
      </div>
    </div>
  );
}
