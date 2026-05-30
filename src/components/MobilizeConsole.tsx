"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Megaphone,
  Check,
  Radio,
  MapPin,
  Send,
  Users,
  Navigation,
  RotateCcw,
} from "lucide-react";
import {
  getNational,
  getDivisions,
  getChildren,
  getMembers,
  resolveNode,
  fmt,
} from "@/lib/data";
import { Avatar } from "@/components/ui";

const STAGES = [
  { key: "division", label: "Division leaders notified", start: 0.0 },
  { key: "upazila", label: "Upazila coordinators alerted", start: 0.14 },
  { key: "union", label: "Union organisers mobilised", start: 0.3 },
  { key: "ward", label: "Ward volunteers on the ground", start: 0.46 },
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function MobilizeConsole() {
  // Selectable targets: national + divisions + a few notable districts.
  const targets = useMemo(() => {
    const nat = getNational();
    const divs = getDivisions();
    const gazipur = getChildren("dhaka").find((d) => d.name === "Gazipur");
    const list = [
      { id: nat.id, label: "Entire Nation", reach: nat.memberCount },
      ...(gazipur ? [{ id: gazipur.id, label: "Gazipur District", reach: gazipur.memberCount }] : []),
      ...divs.map((d) => ({ id: d.id, label: `${d.name} Division`, reach: d.memberCount })),
    ];
    return list;
  }, []);

  const [targetId, setTargetId] = useState(
    targets.find((t) => t.label === "Gazipur District")?.id ?? targets[0].id,
  );
  const target = targets.find((t) => t.id === targetId)!;
  const node = resolveNode(targetId)!;

  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [p, setP] = useState(0);
  const rafRef = useRef<number | null>(null);

  const responders = useMemo(() => {
    const pool = getMembers().filter((m) => m.status === "active");
    return pool.slice(0, 16);
  }, []);

  function start() {
    setPhase("running");
    setP(0);
    const duration = 3200;
    const t0 = performance.now();
    const tick = (now: number) => {
      const raw = Math.min(1, (now - t0) / duration);
      setP(easeOutCubic(raw));
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("done");
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function reset() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    setP(0);
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const reach = target.reach;
  const notified = Math.round(reach * p);
  const responded = Math.round(reach * 0.24 * p);
  const enRoute = Math.round(reach * 0.24 * 0.45 * p);
  const responderCount = Math.min(responders.length, Math.floor(p * responders.length * 1.05));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Control + counters */}
      <div className="lg:col-span-2 space-y-5">
        <div className="panel p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted">Mobilisation target</label>
              <select
                value={targetId}
                onChange={(e) => { reset(); setTargetId(e.target.value); }}
                disabled={phase === "running"}
                className="mt-1 block w-64 px-3 py-2.5 rounded-xl bg-[#0d1626] border border-border outline-none focus:border-[var(--accent)] disabled:opacity-60"
              >
                {targets.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <div className="mt-2 text-sm text-muted flex items-center gap-2">
                <Users size={14} /> Reach: <b className="text-foreground">{fmt(reach)}</b> members
              </div>
            </div>

            {phase === "idle" ? (
              <button
                onClick={start}
                className="pulse-ring inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold text-white text-lg"
                style={{ background: "linear-gradient(135deg, var(--bd-red), #ff6a3d)" }}
              >
                <Megaphone size={20} /> MOBILISE NOW
              </button>
            ) : (
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-medium border border-border text-muted hover:text-foreground"
              >
                <RotateCcw size={16} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Live counters */}
        <div className="grid grid-cols-3 gap-4">
          <Counter icon={<Send size={16} />} label="Notified" value={notified} color="var(--accent-2)" />
          <Counter icon={<Check size={16} />} label="Responded “Coming”" value={responded} color="var(--accent)" />
          <Counter icon={<Navigation size={16} />} label="En route" value={enRoute} color="var(--warn)" />
        </div>

        {/* Cascade stages */}
        <div className="panel p-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold">
            <Radio size={16} className="text-[var(--accent)]" /> Command cascade
          </div>
          <div className="space-y-3">
            {STAGES.map((s) => {
              const local = phase === "idle" ? 0 : Math.max(0, Math.min(1, (p - s.start) / 0.4));
              const done = local >= 0.99;
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full grid place-items-center shrink-0 transition-colors"
                    style={{
                      background: done ? "var(--accent)" : local > 0 ? "rgba(22,199,132,.2)" : "#0d1626",
                      color: done ? "#04130c" : "var(--accent)",
                    }}
                  >
                    {done ? <Check size={15} /> : <span className="text-xs">{Math.round(local * 100)}</span>}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className={local > 0 ? "text-foreground" : "text-muted"}>{s.label}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0c1424] mt-1 overflow-hidden">
                      <div className="h-full rounded-full transition-[width] duration-150" style={{ width: `${local * 100}%`, background: "var(--accent)" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-sm"
              >
                ✅ <b>{fmt(responded)}</b> members confirmed they are coming, <b>{fmt(enRoute)}</b> already en route — mobilised across {target.label} in under 2 hours.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Live responder feed */}
      <div className="panel p-5 self-start">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Live responses</h3>
          <span className="text-xs text-muted flex items-center gap-1">
            <span className="live-dot" /> {phase === "running" ? "incoming" : phase === "done" ? "settled" : "idle"}
          </span>
        </div>
        {phase === "idle" ? (
          <p className="text-sm text-muted py-10 text-center">
            Press <b>Mobilise</b> to broadcast down the hierarchy and watch members respond in real time.
          </p>
        ) : (
          <ul className="space-y-2 max-h-[520px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {responders.slice(0, responderCount).map((m) => (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-[#0d1626]"
                >
                  <Avatar initials={m.initials} hue={m.hue} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-xs text-muted flex items-center gap-1 truncate">
                      <MapPin size={11} /> {m.districtName}
                    </div>
                  </div>
                  <span className="text-xs text-[var(--accent)] font-medium">Coming</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}

function Counter({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2 text-xs text-muted">
        <span style={{ color }}>{icon}</span> {label}
      </div>
      <div className="text-3xl font-bold mt-2 tabular-nums" style={{ color }}>
        {fmt(value)}
      </div>
    </div>
  );
}
