import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SearchResult {
  id: string;
  name: string;
  designation: string;
  status: string;
  score: number;
  district: string;
}

export interface SearchResponse {
  interpreted: string[];
  results: SearchResult[];
}

const ROLE_TERMS = [
  "volunteer", "organiser", "organizer", "secretary", "president",
  "coordinator", "youth", "women", "ward", "union", "joint", "central",
];
const INACTIVE_CUTOFF = 50;

/**
 * Pragmatic "smart search": parse a plain-language query into structured filters
 * (district, status/engagement, role) and run it against the member roster.
 */
export async function searchMembers(query: string): Promise<SearchResponse> {
  const db = createAdminClient();
  const q = query.trim().toLowerCase();
  const interpreted: string[] = [];

  const { data: districts } = await db.from("org_nodes").select("id, name").eq("level", "district");
  const dList = (districts ?? []) as { id: string; name: string }[];
  const nameById = new Map(dList.map((d) => [d.id, d.name]));

  // District match (longest name first to avoid partial collisions).
  let districtId: string | null = null;
  for (const d of [...dList].sort((a, b) => b.name.length - a.name.length)) {
    if (q.includes(d.name.toLowerCase())) { districtId = d.id; interpreted.push(`District: ${d.name}`); break; }
  }

  // Status / engagement.
  let mode: "inactive" | "active" | "pending" | "suspended" | null = null;
  if (/\binactive\b|disengaged|dormant/.test(q)) { mode = "inactive"; interpreted.push("Engagement: inactive (score < 50)"); }
  else if (/\bpending\b|unverified|awaiting/.test(q)) { mode = "pending"; interpreted.push("Status: pending"); }
  else if (/\bsuspended\b/.test(q)) { mode = "suspended"; interpreted.push("Status: suspended"); }
  else if (/\bactive\b|engaged/.test(q)) { mode = "active"; interpreted.push("Engagement: active (score ≥ 50)"); }

  // Role / designation.
  const roleTerm = ROLE_TERMS.find((t) => q.includes(t));
  if (roleTerm) interpreted.push(`Role contains: ${roleTerm}`);

  // Build the query.
  let sel = db.from("profiles").select("id, full_name, designation, status, activity_score, org_node_id");
  if (districtId) sel = sel.like("org_node_id", `${districtId}%`);
  if (mode === "inactive") sel = sel.eq("status", "active").lt("activity_score", INACTIVE_CUTOFF);
  else if (mode === "active") sel = sel.eq("status", "active").gte("activity_score", INACTIVE_CUTOFF);
  else if (mode === "pending") sel = sel.eq("status", "pending");
  else if (mode === "suspended") sel = sel.eq("status", "suspended");
  if (roleTerm) sel = sel.ilike("designation", `%${roleTerm}%`);

  // If nothing structured matched, treat the query as a name search.
  if (!districtId && !mode && !roleTerm && q.length > 1) {
    sel = sel.ilike("full_name", `%${q}%`);
    interpreted.push(`Name contains: “${query.trim()}”`);
  }

  const { data } = await sel.order("activity_score", { ascending: false }).limit(50);
  const rows = (data ?? []) as {
    id: string; full_name: string; designation: string; status: string; activity_score: number; org_node_id: string | null;
  }[];

  const results: SearchResult[] = rows.map((r) => ({
    id: r.id,
    name: r.full_name,
    designation: r.designation,
    status: r.status,
    score: r.activity_score,
    district: r.org_node_id ? nameById.get(r.org_node_id) ?? "—" : "—",
  }));

  return { interpreted, results };
}
