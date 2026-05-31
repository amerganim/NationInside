import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

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
}

interface ProfileLite {
  id: string;
  full_name: string;
  status: string;
  activity_score: number;
  org_node_id: string | null;
  designation: string;
}

/** All leader-dashboard analytics, computed from live data (service role). */
export async function getInsights(): Promise<Insights> {
  const db = createAdminClient();

  const [{ data: profiles }, { data: districts }, { data: scoreRows }, { data: recent },
    { count: eventsCount }, { count: checkIns }, { count: tasksApproved }] = await Promise.all([
    db.from("profiles").select("id, full_name, status, activity_score, org_node_id, designation"),
    db.from("org_nodes").select("id, name").eq("level", "district"),
    db.from("score_events").select("points"),
    db.from("score_events").select("points, source, created_at, profiles(full_name)").order("created_at", { ascending: false }).limit(8),
    db.from("events").select("*", { count: "exact", head: true }),
    db.from("event_attendance").select("*", { count: "exact", head: true }),
    db.from("task_assignments").select("*", { count: "exact", head: true }).eq("status", "approved"),
  ]);

  const ps = (profiles ?? []) as ProfileLite[];
  const nameById = new Map((districts ?? []).map((d: { id: string; name: string }) => [d.id, d.name]));

  const activeMembers = ps.filter((p) => p.status === "active").length;
  const pendingMembers = ps.filter((p) => p.status === "pending").length;
  const suspendedMembers = ps.filter((p) => p.status === "suspended").length;

  const districtTally = new Map<string, number>();
  for (const p of ps) {
    if (p.status !== "active" || !p.org_node_id) continue;
    const name = nameById.get(p.org_node_id) ?? "National";
    districtTally.set(name, (districtTally.get(name) ?? 0) + 1);
  }
  const topDistricts = [...districtTally.entries()]
    .map(([name, members]) => ({ name, members }))
    .sort((a, b) => b.members - a.members)
    .slice(0, 7);

  const topVolunteers = [...ps]
    .filter((p) => p.status === "active")
    .sort((a, b) => b.activity_score - a.activity_score)
    .slice(0, 10)
    .map((p) => ({ id: p.id, name: p.full_name, designation: p.designation, score: p.activity_score }));

  const totalPoints = ((scoreRows ?? []) as { points: number }[]).reduce((a, r) => a + r.points, 0);

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
  };
}
