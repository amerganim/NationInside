/**
 * NationInside — mock data spine.
 *
 * These types intentionally mirror a future Postgres / Supabase schema so the
 * demo can be swapped to a real backend (Phase 1) without touching the UI:
 *   org_nodes(id, parent_id, level, name, name_bn, lat, lng, member_count, ...)
 *   members(id, name, designation, org_node_id, activity_score, ...)
 *
 * All numbers are generated deterministically from a seed, so every screen in
 * the pitch shows the *same* consistent figures on every render/reload.
 */

export type OrgLevel =
  | "national"
  | "division"
  | "district"
  | "upazila"
  | "union"
  | "ward";

export const LEVEL_LABEL: Record<OrgLevel, string> = {
  national: "National Committee",
  division: "Division",
  district: "District",
  upazila: "Upazila",
  union: "Union",
  ward: "Ward",
};

export const NEXT_LEVEL: Record<OrgLevel, OrgLevel | null> = {
  national: "division",
  division: "district",
  district: "upazila",
  upazila: "union",
  union: "ward",
  ward: null,
};

export interface OrgNode {
  id: string;
  name: string;
  nameBn?: string;
  level: OrgLevel;
  parentId: string | null;
  lat: number;
  lng: number;
  memberCount: number;
  activeCount: number;
  volunteerCount: number;
  activityScore: number; // 0-100 organisational health
}

export interface Member {
  id: string;
  name: string;
  nameBn: string;
  initials: string;
  hue: number;
  designation: string;
  districtId: string;
  districtName: string;
  joinDate: string; // ISO
  phoneMasked: string;
  activityScore: number;
  attendance: number; // events attended (last 12mo)
  missions: number; // missions completed
  recruits: number; // members recruited
  verified: boolean;
  status: "active" | "inactive";
}

/* ------------------------------------------------------------------ */
/* Deterministic RNG                                                   */
/* ------------------------------------------------------------------ */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable RNG keyed by any string. */
function rngFor(key: string) {
  return mulberry32(hashStr(key));
}

/** Split `total` into `n` positive integers that sum to exactly `total`. */
function splitCount(total: number, n: number, seedKey: string): number[] {
  const rnd = rngFor(seedKey);
  const weights = Array.from({ length: n }, () => 0.5 + rnd());
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => Math.floor((w / sum) * total));
  let remainder = total - raw.reduce((a, b) => a + b, 0);
  let i = 0;
  while (remainder > 0) {
    raw[i % n] += 1;
    remainder--;
    i++;
  }
  return raw;
}

function deriveStats(memberCount: number, seedKey: string) {
  const rnd = rngFor(seedKey + ":stats");
  const activeRatio = 0.5 + rnd() * 0.34; // 50% - 84%
  const volRatio = 0.07 + rnd() * 0.14; // 7% - 21%
  const activeCount = Math.round(memberCount * activeRatio);
  const volunteerCount = Math.round(memberCount * volRatio);
  const activityScore = Math.round(28 + rnd() * 67); // 28 - 95
  return { activeCount, volunteerCount, activityScore };
}

/* ------------------------------------------------------------------ */
/* Geography (real Bangladesh divisions & districts)                   */
/* ------------------------------------------------------------------ */

interface DivisionSeed {
  id: string;
  name: string;
  nameBn: string;
  lat: number;
  lng: number;
  weight: number; // share of national membership
  districts: string[];
}

const DIVISIONS: DivisionSeed[] = [
  {
    id: "dhaka",
    name: "Dhaka",
    nameBn: "ঢাকা",
    lat: 23.81,
    lng: 90.41,
    weight: 26,
    districts: [
      "Dhaka", "Gazipur", "Narayanganj", "Tangail", "Narsingdi", "Munshiganj",
      "Manikganj", "Kishoreganj", "Faridpur", "Gopalganj", "Madaripur",
      "Rajbari", "Shariatpur",
    ],
  },
  {
    id: "chattogram",
    name: "Chattogram",
    nameBn: "চট্টগ্রাম",
    lat: 22.35,
    lng: 91.83,
    weight: 21,
    districts: [
      "Chattogram", "Cox's Bazar", "Cumilla", "Brahmanbaria", "Chandpur",
      "Feni", "Noakhali", "Lakshmipur", "Khagrachhari", "Rangamati", "Bandarban",
    ],
  },
  {
    id: "khulna",
    name: "Khulna",
    nameBn: "খুলনা",
    lat: 22.85,
    lng: 89.54,
    weight: 12,
    districts: [
      "Khulna", "Jashore", "Satkhira", "Bagerhat", "Jhenaidah", "Magura",
      "Narail", "Kushtia", "Chuadanga", "Meherpur",
    ],
  },
  {
    id: "rajshahi",
    name: "Rajshahi",
    nameBn: "রাজশাহী",
    lat: 24.37,
    lng: 88.6,
    weight: 12,
    districts: [
      "Rajshahi", "Natore", "Naogaon", "Chapainawabganj", "Pabna", "Bogura",
      "Joypurhat", "Sirajganj",
    ],
  },
  {
    id: "barishal",
    name: "Barishal",
    nameBn: "বরিশাল",
    lat: 22.7,
    lng: 90.37,
    weight: 7,
    districts: [
      "Barishal", "Patuakhali", "Bhola", "Pirojpur", "Barguna", "Jhalokati",
    ],
  },
  {
    id: "sylhet",
    name: "Sylhet",
    nameBn: "সিলেট",
    lat: 24.9,
    lng: 91.87,
    weight: 7,
    districts: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  },
  {
    id: "rangpur",
    name: "Rangpur",
    nameBn: "রংপুর",
    lat: 25.74,
    lng: 89.27,
    weight: 9,
    districts: [
      "Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari",
      "Panchagarh", "Thakurgaon", "Lalmonirhat",
    ],
  },
  {
    id: "mymensingh",
    name: "Mymensingh",
    nameBn: "ময়মনসিংহ",
    lat: 24.75,
    lng: 90.4,
    weight: 6,
    districts: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
  },
];

const NATIONAL_TOTAL = 1_250_000;

const UPAZILA_NAMES = [
  "Sadar", "Kaliganj", "Sreepur", "Kaliakair", "Kapasia", "Mirzapur",
  "Shibpur", "Belabo", "Raipura", "Palash", "Savar", "Dhamrai",
];
const UNION_NAMES = [
  "Baliadi", "Jamalpur", "Tumilia", "Nagari", "Bahadursadi", "Moktarpur",
  "Jangalia", "Sutrapur", "Bhabanipur", "Char Para", "Uttarpara", "Dakshinpara",
];

/* ------------------------------------------------------------------ */
/* Node graph (national + divisions + districts are eager;             */
/*  upazila/union/ward are generated on demand, deterministically)     */
/* ------------------------------------------------------------------ */

let _nodes: Map<string, OrgNode> | null = null;

function buildBaseGraph(): Map<string, OrgNode> {
  if (_nodes) return _nodes;
  const map = new Map<string, OrgNode>();

  const nat: OrgNode = {
    id: "national",
    name: "National Committee",
    nameBn: "জাতীয় কমিটি",
    level: "national",
    parentId: null,
    lat: 23.8,
    lng: 90.35,
    memberCount: NATIONAL_TOTAL,
    ...deriveStats(NATIONAL_TOTAL, "national"),
  };
  // National active = sum of divisions for consistency; recompute after.
  map.set(nat.id, nat);

  const totalWeight = DIVISIONS.reduce((a, d) => a + d.weight, 0);
  let natActive = 0;
  let natVol = 0;

  for (const d of DIVISIONS) {
    const divMembers = Math.round((d.weight / totalWeight) * NATIONAL_TOTAL);
    const divStats = deriveStats(divMembers, d.id);
    const divNode: OrgNode = {
      id: d.id,
      name: d.name,
      nameBn: d.nameBn,
      level: "division",
      parentId: "national",
      lat: d.lat,
      lng: d.lng,
      memberCount: divMembers,
      ...divStats,
    };
    map.set(divNode.id, divNode);

    const distCounts = splitCount(divMembers, d.districts.length, d.id + ":dist");
    const rndGeo = rngFor(d.id + ":geo");
    d.districts.forEach((distName, idx) => {
      const id = `${d.id}-${idx}`;
      const dm = distCounts[idx];
      const ds = deriveStats(dm, id);
      map.set(id, {
        id,
        name: distName,
        level: "district",
        parentId: d.id,
        lat: d.lat + (rndGeo() - 0.5) * 1.1,
        lng: d.lng + (rndGeo() - 0.5) * 1.1,
        memberCount: dm,
        ...ds,
      });
    });

    natActive += divStats.activeCount;
    natVol += divStats.volunteerCount;
  }

  // Make the national headline consistent with the divisions beneath it.
  nat.activeCount = natActive;
  nat.volunteerCount = natVol;

  _nodes = map;
  return map;
}

export function getNode(id: string): OrgNode | undefined {
  return buildBaseGraph().get(id);
}

/** Children of a node — generated on demand below district level. */
export function getChildren(id: string): OrgNode[] {
  const map = buildBaseGraph();
  const node = map.get(id);
  if (!node) return [];

  // Eager levels live in the map already.
  const eager = [...map.values()].filter((n) => n.parentId === id);
  if (eager.length) return sortByMembers(eager);

  const childLevel = NEXT_LEVEL[node.level];
  if (!childLevel) return [];

  const namePool =
    childLevel === "upazila"
      ? UPAZILA_NAMES
      : childLevel === "union"
        ? UNION_NAMES
        : null;

  const rnd = rngFor(id + ":children");
  const count =
    childLevel === "upazila"
      ? 4 + Math.floor(rnd() * 4) // 4-7
      : childLevel === "union"
        ? 5 + Math.floor(rnd() * 5) // 5-9
        : 9; // wards 1-9

  const counts = splitCount(node.memberCount, count, id + ":split");
  const children: OrgNode[] = [];
  for (let i = 0; i < count; i++) {
    const cid = `${id}.${i}`;
    const name = namePool
      ? `${namePool[i % namePool.length]}${childLevel === "upazila" ? "" : ` ${i + 1}`}`
      : `Ward ${i + 1}`;
    const cm = counts[i];
    children.push({
      id: cid,
      name,
      level: childLevel,
      parentId: id,
      lat: node.lat + (rngFor(cid + "la")() - 0.5) * 0.3,
      lng: node.lng + (rngFor(cid + "ln")() - 0.5) * 0.3,
      memberCount: cm,
      ...deriveStats(cm, cid),
    });
  }
  return sortByMembers(children);
}

function sortByMembers(arr: OrgNode[]): OrgNode[] {
  return [...arr].sort((a, b) => b.memberCount - a.memberCount);
}

/** Breadcrumb path from national down to the given node. */
export function getPath(id: string): OrgNode[] {
  const map = buildBaseGraph();
  const path: OrgNode[] = [];
  let cur: OrgNode | undefined = map.get(id) ?? generatedNode(id);
  while (cur) {
    path.unshift(cur);
    cur = cur.parentId ? map.get(cur.parentId) ?? generatedNode(cur.parentId) : undefined;
  }
  return path;
}

/** Resolve a generated (below-district) node id back into a node. */
function generatedNode(id: string): OrgNode | undefined {
  const map = buildBaseGraph();
  if (map.has(id)) return map.get(id);
  const dot = id.lastIndexOf(".");
  if (dot === -1) return undefined;
  const parentId = id.substring(0, dot);
  return getChildren(parentId).find((c) => c.id === id);
}

/** Resolve any node id (including generated sub-district nodes). */
export function resolveNode(id: string): OrgNode | undefined {
  const path = getPath(id);
  return path[path.length - 1];
}

export function getDivisions(): OrgNode[] {
  return DIVISIONS.map((d) => getNode(d.id)!).filter(Boolean);
}

export function getAllDistricts(): OrgNode[] {
  return [...buildBaseGraph().values()].filter((n) => n.level === "district");
}

export function getNational(): OrgNode {
  return getNode("national")!;
}

/* ------------------------------------------------------------------ */
/* Members (sample detail records for ID cards & leaderboards)         */
/* ------------------------------------------------------------------ */

const FIRST_NAMES = [
  "Abdul", "Mohammad", "Rahim", "Karim", "Jahangir", "Shahidul", "Nasir",
  "Kamal", "Jamal", "Rafiq", "Aminul", "Mizanur", "Habibur", "Anwar",
  "Faisal", "Tanvir", "Sabbir", "Imran", "Rasel", "Sohel", "Arif", "Mahmud",
  "Shafiq", "Ruhul", "Golam", "Delwar", "Saiful", "Monir",
];
const LAST_NAMES = [
  "Islam", "Hossain", "Ahmed", "Rahman", "Khan", "Chowdhury", "Mia",
  "Sarkar", "Uddin", "Akter", "Talukder", "Bhuiyan", "Molla", "Mondol",
  "Sheikh", "Howlader", "Patwary", "Gazi",
];
const FEMALE_FIRST = ["Nasrin", "Salma", "Rokeya", "Fatema", "Shirin", "Taslima", "Marium", "Sultana"];

const NAME_BN: Record<string, string> = {
  Abdul: "আব্দুল", Mohammad: "মোহাম্মদ", Rahim: "রহিম", Karim: "করিম",
  Islam: "ইসলাম", Hossain: "হোসেন", Ahmed: "আহমেদ", Rahman: "রহমান",
  Khan: "খান", Chowdhury: "চৌধুরী",
};

const DESIGNATIONS = [
  { title: "Ward Organiser", weight: 30 },
  { title: "Union Volunteer", weight: 28 },
  { title: "Upazila Secretary", weight: 14 },
  { title: "District Joint Secretary", weight: 8 },
  { title: "Youth Wing Coordinator", weight: 9 },
  { title: "Women's Wing Leader", weight: 5 },
  { title: "District President", weight: 3 },
  { title: "Central Committee Member", weight: 3 },
];

function pickWeighted<T extends { weight: number }>(arr: T[], r: number): T {
  const total = arr.reduce((a, b) => a + b.weight, 0);
  let t = r * total;
  for (const item of arr) {
    if (t < item.weight) return item;
    t -= item.weight;
  }
  return arr[arr.length - 1];
}

let _members: Member[] | null = null;

export function getMembers(): Member[] {
  if (_members) return _members;
  const districts = getAllDistricts();
  const out: Member[] = [];
  const N = 180;
  for (let i = 0; i < N; i++) {
    const r = rngFor("member:" + i);
    const female = r() < 0.18;
    const first = female
      ? FEMALE_FIRST[Math.floor(r() * FEMALE_FIRST.length)]
      : FIRST_NAMES[Math.floor(r() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(r() * LAST_NAMES.length)];
    const name = `${first} ${last}`;
    const nameBn = `${NAME_BN[first] ?? first} ${NAME_BN[last] ?? last}`;
    const district = districts[Math.floor(r() * districts.length)];
    const desig = pickWeighted(DESIGNATIONS, r());
    const score = Math.round(20 + r() * 80);
    const year = 2014 + Math.floor(r() * 11);
    const month = 1 + Math.floor(r() * 12);
    const day = 1 + Math.floor(r() * 28);
    out.push({
      id: `BD-${String(100000 + i)}`,
      name,
      nameBn,
      initials: (first[0] + last[0]).toUpperCase(),
      hue: Math.floor(r() * 360),
      designation: desig.title,
      districtId: district.id,
      districtName: district.name,
      joinDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      phoneMasked: `+8801${Math.floor(r() * 9)}****${Math.floor(1000 + r() * 8999)}`,
      activityScore: score,
      attendance: Math.round(r() * 58),
      missions: Math.round(r() * 42),
      recruits: Math.round(r() * 180),
      verified: r() > 0.18,
      status: score > 45 ? "active" : "inactive",
    });
  }
  _members = out;
  return out;
}

export function getMember(id: string): Member | undefined {
  return getMembers().find((m) => m.id === id);
}

export function getTopMembers(n = 20): Member[] {
  return [...getMembers()].sort((a, b) => b.activityScore - a.activityScore).slice(0, n);
}

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

export type ActivityKind = "rally" | "relief" | "meeting" | "recruitment" | "complaint";

export interface Activity {
  id: string;
  kind: ActivityKind;
  title: string;
  when: string;
  volunteers: number;
}

const ACTIVITY_TEMPLATES: { kind: ActivityKind; title: string }[] = [
  { kind: "rally", title: "Ward youth rally held" },
  { kind: "relief", title: "Flood relief distribution" },
  { kind: "meeting", title: "Committee coordination meeting" },
  { kind: "recruitment", title: "New member enrolment drive" },
  { kind: "complaint", title: "Local complaint resolved" },
  { kind: "relief", title: "Blood donation camp" },
  { kind: "rally", title: "Street-corner gathering" },
];

const WHEN = ["2h ago", "5h ago", "Yesterday", "2 days ago", "3 days ago", "Last week"];

/** Deterministic recent-activity feed for any org node. */
export function getActivities(nodeId: string): Activity[] {
  const rnd = rngFor(nodeId + ":act");
  const n = 4 + Math.floor(rnd() * 3);
  const out: Activity[] = [];
  for (let i = 0; i < n; i++) {
    const t = ACTIVITY_TEMPLATES[Math.floor(rnd() * ACTIVITY_TEMPLATES.length)];
    out.push({
      id: `${nodeId}-act-${i}`,
      kind: t.kind,
      title: t.title,
      when: WHEN[Math.min(i, WHEN.length - 1)],
      volunteers: 5 + Math.floor(rnd() * 120),
    });
  }
  return out;
}

export interface GrowthPoint {
  month: string;
  members: number;
  volunteers: number;
}

/** 12-month membership growth ending at the current national total. */
export function getGrowthSeries(): GrowthPoint[] {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const end = NATIONAL_TOTAL;
  const start = Math.round(end * 0.58);
  const rnd = rngFor("growth");
  const out: GrowthPoint[] = [];
  for (let i = 0; i < months.length; i++) {
    const t = i / (months.length - 1);
    const base = start + (end - start) * t;
    const jitter = (rnd() - 0.5) * 0.015 * end;
    const members = Math.round(base + jitter * (i === months.length - 1 ? 0 : 1));
    out.push({
      month: months[i],
      members: i === months.length - 1 ? end : members,
      volunteers: Math.round(members * (0.13 + rnd() * 0.04)),
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Nomination intelligence                                             */
/* ------------------------------------------------------------------ */

export interface CandidateMetrics {
  network: number; // ground network size
  activity: number; // member activity under them
  events: number; // events organised
  complaints: number; // complaints resolved
  popularity: number; // local popularity / sentiment
}

export interface Candidate {
  id: string;
  name: string;
  nameBn: string;
  initials: string;
  hue: number;
  age: number;
  designation: string;
  metrics: CandidateMetrics;
  score: number;
  recommended: boolean;
}

export interface Constituency {
  id: string;
  seat: string;
  division: string;
  electorate: number;
  contenders: Candidate[];
}

const SEATS = [
  { seat: "Dhaka-7", division: "Dhaka" },
  { seat: "Gazipur-2", division: "Dhaka" },
  { seat: "Chattogram-10", division: "Chattogram" },
  { seat: "Cumilla-5", division: "Chattogram" },
  { seat: "Sylhet-1", division: "Sylhet" },
  { seat: "Rangpur-3", division: "Rangpur" },
  { seat: "Khulna-2", division: "Khulna" },
  { seat: "Bogura-6", division: "Rajshahi" },
];

const METRIC_WEIGHTS: CandidateMetrics = {
  network: 0.26,
  activity: 0.22,
  events: 0.16,
  complaints: 0.16,
  popularity: 0.2,
};

let _constituencies: Constituency[] | null = null;

export function getConstituencies(): Constituency[] {
  if (_constituencies) return _constituencies;
  const out: Constituency[] = SEATS.map((s, si) => {
    const rnd = rngFor("seat:" + s.seat);
    const n = 2 + Math.floor(rnd() * 2); // 2-3 contenders
    const contenders: Candidate[] = [];
    for (let i = 0; i < n; i++) {
      const r = rngFor(`seat:${s.seat}:c${i}`);
      const first = FIRST_NAMES[Math.floor(r() * FIRST_NAMES.length)];
      const last = LAST_NAMES[Math.floor(r() * LAST_NAMES.length)];
      const metrics: CandidateMetrics = {
        network: Math.round(40 + r() * 60),
        activity: Math.round(40 + r() * 60),
        events: Math.round(35 + r() * 65),
        complaints: Math.round(30 + r() * 70),
        popularity: Math.round(40 + r() * 60),
      };
      const score = Math.round(
        (Object.keys(metrics) as (keyof CandidateMetrics)[]).reduce(
          (acc, k) => acc + metrics[k] * METRIC_WEIGHTS[k],
          0,
        ),
      );
      contenders.push({
        id: `${s.seat}-c${i}`,
        name: `${first} ${last}`,
        nameBn: `${NAME_BN[first] ?? first} ${NAME_BN[last] ?? last}`,
        initials: (first[0] + last[0]).toUpperCase(),
        hue: Math.floor(r() * 360),
        age: 38 + Math.floor(r() * 28),
        designation: pickWeighted(DESIGNATIONS.slice(2), r()).title,
        metrics,
        score,
        recommended: false,
      });
    }
    contenders.sort((a, b) => b.score - a.score);
    contenders[0].recommended = true;
    return {
      id: `seat-${si}`,
      seat: s.seat,
      division: s.division,
      electorate: 280000 + Math.floor(rnd() * 180000),
      contenders,
    };
  });
  _constituencies = out;
  return out;
}

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtCompact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}
