import { Trophy, AlertTriangle, ShieldCheck, Flame } from "lucide-react";
import { getTopMembers, getAllDistricts, getMembers, fmt } from "@/lib/data";
import { KpiCard } from "@/components/ui";
import ActivityBoard from "@/components/ActivityBoard";

export default function ActivityPage() {
  const members = getMembers();
  const topMembers = getTopMembers(30);
  const districts = [...getAllDistricts()].sort((a, b) => b.activityScore - a.activityScore);

  const active = members.filter((m) => m.status === "active").length;
  const paper = members.length - active;
  const paperPct = Math.round((paper / members.length) * 100);
  const attention = districts.filter((d) => d.activityScore < 50).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Political Activity Score</h1>
        <p className="text-muted mt-1 max-w-2xl">
          A “credit score” for political work — built from attendance, missions,
          and recruitment. Instantly separate real workers from name-only members.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Top Performer" value={`${topMembers[0].activityScore}`} delta={topMembers[0].name} icon={<Trophy size={18} />} />
        <KpiCard label="Active Workers" value={fmt(active)} delta={`of ${fmt(members.length)} sampled`} icon={<ShieldCheck size={18} />} accent="var(--accent-2)" />
        <KpiCard label="“Paper” Members" value={`${paperPct}%`} delta="low engagement — needs review" icon={<Flame size={18} />} accent="var(--danger)" />
        <KpiCard label="Districts Needing Attention" value={`${attention}`} delta="health score below 50" icon={<AlertTriangle size={18} />} accent="var(--warn)" />
      </div>

      <ActivityBoard members={topMembers} districts={districts} />
    </div>
  );
}
