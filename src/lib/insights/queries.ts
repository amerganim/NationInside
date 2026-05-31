import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MapPoint } from "@/components/MapBangladesh";

export interface TrendPoint {
  label: string;
  activity: number;
  joined: number;
}

export interface Insights {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  suspendedMembers: number;
  eventsCount: number;
  checkIns: number;
  tasksApproved: number;
  totalPoints: number;
  statusBreakdown: { name: string; value: number; color: string }[];
  topDistricts: { name: string; members: number }[];
  topVolunteers: { id: string; name: string; designation: string; score: number }[];
  recent: { name: string; source: string; points: number; when: string }[];
  trend: TrendPoint[];
  mapPoints: MapPoint[];
}

interface ProfileLite {
  id: string;
  full_name: string;
  status: string;
  activity_score: number;
  org_node_id: string | null;
  designation: string;
  joined_at: string;
}

interface DistrictLite {
  id: string;
  name: string;
  lat: number | null;
  lng: number | null;
}

/** All leader-dashboard analytics, computed from live data (service role). */
export async function getInsights(): Promise<Insights> {
  const db = createAdminClient();

  const [{ data: profiles }, { data: districts }, { data: scoreRows }, { data: recent },
    { count: eventsCount }, { count: checkIns }, { count: tasksApproved }] = await Promise.all([
    db.from("profiles").select("id, full_name, status, activity_score, org_node_id, designation, joined_at"),
    db.from("org_nodes").select("id, name, lat, lng").eq("level", "district"),
    db.from("score_events").select("created_at, points"),
    db.from("score_events").select("points, source, created_at, profiles(full_name)").order("created_at", { ascending: false }).limit(8),
    db.from("events").select("*", { count: "exact", head: true }),
    db.from("event_attendance").select("*", { count: "exact", head: true }),
    db.from("task_assignments").select("*", { count: "exact", head: true }).eq("status", "approved"),
  ]);

  const ps = (profiles ?? []) as ProfileLite[];
  const ds = (districts ?? []) as DistrictLite[];
  const byId = new Map(ds.map((d) => [d.id, d]));

  const activeMembers = ps.filter((p) => p.status === "active").length;
  const pendingMembers = ps.filter((p) => p.status === "pending").length;
  const suspendedMembers = ps.filter((p) => p.status === "suspended").length;

  // Per-district stats (members, active, average score).
  const stats = new Map<string, { total: number; active: number; scoreSum: number }>();
  for (const p of ps) {
    if (!p.org_node_id || !byId.has(p.org_node_id)) continue;
    const s = stats.get(p.org_node_id) ?? { total: 0, active: 0, scoreSum: 0 };
    s.total++;
    if (p.status === "active") { s.active++; s.scoreSum += p.activity_score; }
    stats.set(p.org_node_id, s);
  }

  const topDistricts = [...stats.entries()]
    .map(([id, s]) => ({ name: byId.get(id)?.name ?? "—", members: s.active }))
    .filter((d) => d.members > 0)
    .sort((a, b) => b.members - a.members)
    .slice(0, 7);

  const mapPoints: MapPoint[] = [...stats.entries()]
    .map(([id, s]) => {
      const d = byId.get(id)!;
      return {
        id,
        name: d.name,
        lat: d.lat ?? 23.8,
        lng: d.lng ?? 90.3,
        memberCount: s.total,
        activeCount: s.active,
        activityScore: s.active ? Math.round(s.scoreSum / s.active) : 0,
      };
    })
    .filter((p) => p.memberCount > 0);

  const topVolunteers = [...ps]
    .filter((p) => p.status === "active")
    .sort((a, b) => b.activity_score - a.activity_score)
    .slice(0, 10)
    .map((p) => ({ id: p.id, name: p.full_name, designation: p.designation, score: p.activity_score }));

  const scores = (scoreRows ?? []) as { created_at: string; points: number }[];
  const totalPoints = scores.reduce((a, r) => a + r.points, 0);

  // 30-day engagement trend (activity events + new members per day).
  const DAYS = 30;
  const buckets = new Map<string, { activity: number; joined: number }>();
  const order: string[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    const key = dt.toISOString().slice(0, 10);
    buckets.set(key, { activity: 0, joined: 0 });
    order.push(key);
  }
  for (const r of scores) {
    const k = r.created_at.slice(0, 10);
    const b = buckets.get(k);
    if (b) b.activity++;
  }
  for (const p of ps) {
    const k = p.joined_at.slice(0, 10);
    const b = buckets.get(k);
    if (b) b.joined++;
  }
  const trend: TrendPoint[] = order.map((k) => {
    const b = buckets.get(k)!;
    return { label: k.slice(5), activity: b.activity, joined: b.joined };
  });

  const recentRows = (recent ?? []) as unknown as {
    points: number; source: string; created_at: string; profiles: { full_name: string } | null;
  }[];

  return {
    totalMembers: ps.length,
    activeMembers,
    pendingMembers,
    suspendedMembers,
    eventsCount: eventsCount ?? 0,
    checkIns: checkIns ?? 0,
    tasksApproved: tasksApproved ?? 0,
    totalPoints,
    statusBreakdown: [
      { name: "Active", value: activeMembers, color: "#16c784" },
      { name: "Pending", value: pendingMembers, color: "#f5a524" },
      { name: "Suspended", value: suspendedMembers, color: "#ef4444" },
    ].filter((s) => s.value > 0),
    topDistricts,
    topVolunteers,
    recent: recentRows.map((r) => ({
      name: r.profiles?.full_name ?? "A member",
      source: r.source,
      points: r.points,
      when: r.created_at,
    })),
    trend,
    mapPoints,
  };
}
