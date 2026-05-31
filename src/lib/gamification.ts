// Ranks & achievement badges — derived from the activity score and score ledger.

export interface Rank {
  name: string;
  color: string;
  min: number;
}

// Ordered high → low so findIndex returns the highest tier reached.
export const RANKS: Rank[] = [
  { name: "Party Champion", color: "#f5a524", min: 80 },
  { name: "Senior Organiser", color: "#16c784", min: 60 },
  { name: "Active Organiser", color: "#2f80ed", min: 40 },
  { name: "Volunteer", color: "#7b5cff", min: 20 },
  { name: "Newcomer", color: "#8ea0c2", min: 0 },
];

export function rankFor(score: number): Rank {
  return RANKS.find((r) => score >= r.min) ?? RANKS[RANKS.length - 1];
}

export function rankProgress(score: number): { current: Rank; next: Rank | null; pct: number } {
  const idx = RANKS.findIndex((r) => score >= r.min);
  const current = RANKS[idx];
  const next = idx > 0 ? RANKS[idx - 1] : null; // higher tier = lower index
  if (!next) return { current, next: null, pct: 100 };
  const span = next.min - current.min;
  const pct = Math.max(0, Math.min(100, Math.round(((score - current.min) / span) * 100)));
  return { current, next, pct };
}

export interface MemberCounts {
  attendance: number;
  task: number;
  mobilization: number;
}

export interface BadgeProgress {
  key: string;
  name: string;
  icon: string; // lucide icon key, mapped in the component
  count: number;
  tier: number; // 0 = locked, 1 = bronze, 2 = silver, 3 = gold
  tierName: string;
  next: number | null; // next threshold to reach
}

const TIER_NAMES = ["Locked", "Bronze", "Silver", "Gold"];
const TIER_COLORS = ["#33425f", "#d8915b", "#c7d0dd", "#ffd24a"];
const THRESHOLDS = [1, 5, 15];

export function tierColor(tier: number): string {
  return TIER_COLORS[Math.min(tier, TIER_COLORS.length - 1)];
}

function progress(count: number): { tier: number; next: number | null } {
  let tier = 0;
  for (let i = 0; i < THRESHOLDS.length; i++) if (count >= THRESHOLDS[i]) tier = i + 1;
  const next = tier < THRESHOLDS.length ? THRESHOLDS[tier] : null;
  return { tier, next };
}

export function computeBadges(c: MemberCounts): BadgeProgress[] {
  const defs = [
    { key: "attendance", name: "Event Attendee", icon: "CalendarCheck", count: c.attendance },
    { key: "task", name: "Mission Specialist", icon: "Target", count: c.task },
    { key: "mobilization", name: "Rapid Responder", icon: "Megaphone", count: c.mobilization },
  ];
  return defs.map((d) => {
    const { tier, next } = progress(d.count);
    return { ...d, tier, tierName: TIER_NAMES[tier], next };
  });
}
