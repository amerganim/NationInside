"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  Users,
  UserCheck,
  HeartHandshake,
  Megaphone,
  Droplet,
  Handshake,
  UserPlus,
  MessageSquareWarning,
  CornerDownRight,
  AlertTriangle,
} from "lucide-react";
import {
  getChildren,
  getActivities,
  getPath,
  resolveNode,
  LEVEL_LABEL,
  NEXT_LEVEL,
  fmt,
  type ActivityKind,
} from "@/lib/data";
import { Panel, ScoreBar, Badge, scoreColor } from "@/components/ui";

const ACT_ICON: Record<ActivityKind, React.ElementType> = {
  rally: Megaphone,
  relief: Droplet,
  meeting: Handshake,
  recruitment: UserPlus,
  complaint: MessageSquareWarning,
};

export default function HierarchyPage() {
  const [currentId, setCurrentId] = useState("national");
  const node = resolveNode(currentId);
  const path = getPath(currentId);
  const children = getChildren(currentId);
  const activities = getActivities(currentId);
  if (!node) return null;

  const childLevel = NEXT_LEVEL[node.level];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organisation Tree</h1>
        <p className="text-muted mt-1">
          Drill from the National Committee down to a single ward — every level
          shows live strength and activity.
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 flex-wrap text-sm">
        {path.map((p, i) => (
          <span key={p.id} className="flex items-center gap-1">
            <button
              onClick={() => setCurrentId(p.id)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                p.id === currentId
                  ? "bg-[var(--accent)]/15 text-foreground font-medium"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              {p.name}
            </button>
            {i < path.length - 1 && <ChevronRight size={14} className="text-muted" />}
          </span>
        ))}
      </div>

      {/* Current node summary */}
      <div className="panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
              {LEVEL_LABEL[node.level]}
            </div>
            <div className="text-2xl font-bold mt-1 flex items-center gap-3">
              {node.name}
              {node.nameBn && <span className="text-muted text-lg font-normal">{node.nameBn}</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted">Organisational health</div>
              <div className="text-xl font-bold" style={{ color: scoreColor(node.activityScore) }}>
                {node.activityScore}/100
              </div>
            </div>
            <div className="w-28"><ScoreBar score={node.activityScore} /></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5">
          <Stat icon={<Users size={16} />} label="Members" value={fmt(node.memberCount)} />
          <Stat icon={<UserCheck size={16} />} label="Active" value={fmt(node.activeCount)} accent="var(--accent-2)" />
          <Stat icon={<HeartHandshake size={16} />} label="Volunteers" value={fmt(node.volunteerCount)} accent="var(--bd-red)" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Children */}
        <div className="lg:col-span-2">
          <Panel
            title={childLevel ? `${LEVEL_LABEL[childLevel]}s (${children.length})` : "Lowest level"}
            subtitle={childLevel ? "Click any unit to drill deeper" : "This ward is the smallest organisational unit"}
          >
            {childLevel ? (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid sm:grid-cols-2 gap-3"
                >
                  {children.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCurrentId(c.id)}
                      className="text-left rounded-xl border border-border bg-[#0d1626] hover:bg-[#101c33] transition-colors p-4 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-2">
                          <CornerDownRight size={14} className="text-muted" />
                          {c.name}
                        </span>
                        <ChevronRight size={16} className="text-muted group-hover:text-foreground" />
                      </div>
                      <div className="flex items-center justify-between mt-3 text-sm">
                        <span className="text-muted">{fmt(c.memberCount)} members</span>
                        {c.activityScore < 50 ? (
                          <Badge color="var(--danger)">
                            <AlertTriangle size={11} /> Needs attention
                          </Badge>
                        ) : (
                          <span className="text-muted">{fmt(c.activeCount)} active</span>
                        )}
                      </div>
                      <div className="mt-2"><ScoreBar score={c.activityScore} /></div>
                    </button>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <p className="text-muted text-sm py-8 text-center">
                You have reached ward level — the grassroots of the organisation.
              </p>
            )}
          </Panel>
        </div>

        {/* Activity feed */}
        <Panel title="Recent Activity" subtitle={`In ${node.name}`}>
          <ul className="space-y-3">
            {activities.map((a) => {
              const Icon = ACT_ICON[a.kind];
              return (
                <li key={a.id} className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg grid place-items-center bg-white/5 text-[var(--accent)] shrink-0">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted">
                      {a.when} · {a.volunteers} volunteers
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  accent = "var(--accent)",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl bg-[#0d1626] border border-border p-4">
      <div className="flex items-center gap-2 text-xs text-muted">
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </div>
      <div className="text-xl font-bold mt-1 tabular-nums">{value}</div>
    </div>
  );
}
