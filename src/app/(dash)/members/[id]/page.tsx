import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Activity, CalendarCheck, Target, UserPlus } from "lucide-react";
import { getMember, getMembers, fmt } from "@/lib/data";
import DigitalIdCard from "@/components/DigitalIdCard";
import { Panel, ScoreBar, scoreColor } from "@/components/ui";

export function generateStaticParams() {
  return getMembers().slice(0, 30).map((m) => ({ id: m.id }));
}

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = getMember(id);
  if (!member) notFound();

  const stats = [
    { icon: Activity, label: "Activity Score", value: `${member.activityScore}/100`, color: scoreColor(member.activityScore) },
    { icon: CalendarCheck, label: "Events Attended", value: fmt(member.attendance), color: "var(--accent-2)" },
    { icon: Target, label: "Missions Completed", value: fmt(member.missions), color: "var(--warn)" },
    { icon: UserPlus, label: "Members Recruited", value: fmt(member.recruits), color: "var(--bd-red)" },
  ];

  return (
    <div className="space-y-6">
      <Link href="/members" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={16} /> Back to members
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex justify-center lg:justify-start">
          <DigitalIdCard member={member} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Panel title="Contribution Profile" subtitle="Last 12 months of party activity">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-[#0d1626] border border-border p-4">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <s.icon size={15} style={{ color: s.color }} /> {s.label}
                  </div>
                  <div className="text-2xl font-bold mt-1 tabular-nums">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted">Overall standing</span>
                <span className="font-semibold" style={{ color: scoreColor(member.activityScore) }}>
                  {member.activityScore >= 70 ? "Top performer" : member.activityScore >= 45 ? "Steady contributor" : "Low engagement"}
                </span>
              </div>
              <ScoreBar score={member.activityScore} />
            </div>
          </Panel>

          <Panel title="Contact &amp; Verification">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <Info label="Phone" value={member.phoneMasked} />
              <Info label="Status" value={member.status} />
              <Info label="District" value={member.districtName} />
              <Info label="Verification" value={member.verified ? "Verified" : "Pending"} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className="font-medium capitalize">{value}</div>
    </div>
  );
}
