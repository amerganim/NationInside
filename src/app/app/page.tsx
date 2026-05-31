import Link from "next/link";
import { Clock, Target, CalendarDays, Megaphone, TrendingUp, Pencil } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { Panel, ScoreBar, scoreColor } from "@/components/ui";
import MemberIdCard from "@/components/app/MemberIdCard";

export const dynamic = "force-dynamic";

export default async function MemberHome() {
  const { userId, email, profile, orgNode } = await getSession();
  const name = profile?.full_name || email || "Member";
  const pending = profile?.status !== "active";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {name.split(" ")[0]} 👋</h1>
        <p className="text-muted mt-1">Your party dashboard.</p>
      </div>

      {pending && (
        <div className="panel p-5 border-l-4 flex items-start gap-3" style={{ borderLeftColor: "var(--warn)" }}>
          <Clock size={20} className="text-[var(--warn)] mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold">Your account is awaiting verification</div>
            <p className="text-sm text-muted mt-1">
              A district admin will review and approve your membership shortly. Some
              features unlock once you are verified. You can still set up your profile.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col items-center lg:items-start gap-3">
          <MemberIdCard
            id={userId ?? ""}
            name={name}
            nameBn={profile?.name_bn}
            designation={profile?.designation ?? "Member"}
            orgName={orgNode?.name ?? "Unassigned"}
            status={profile?.status ?? "pending"}
            joinedAt={profile?.joined_at ?? new Date().toISOString()}
            photoUrl={profile?.photo_url}
          />
          <Link href="/app/profile" className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline">
            <Pencil size={14} /> Edit profile &amp; photo
          </Link>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Panel title="Your Activity Score" subtitle="Earned from attendance, missions and recruitment">
            <div className="flex items-end justify-between mb-2">
              <span className="text-4xl font-bold" style={{ color: scoreColor(profile?.activity_score ?? 0) }}>
                {profile?.activity_score ?? 0}
              </span>
              <span className="text-sm text-muted flex items-center gap-1"><TrendingUp size={14} /> out of 100</span>
            </div>
            <ScoreBar score={profile?.activity_score ?? 0} />
          </Panel>

          <div className="grid sm:grid-cols-3 gap-4">
            <QuickLink href="/app/tasks" icon={<Target size={20} />} label="My Tasks" desc="Missions assigned to you" />
            <QuickLink href="/app/events" icon={<CalendarDays size={20} />} label="Events" desc="Check in with QR" />
            <QuickLink href="/app/mobilize" icon={<Megaphone size={20} />} label="Mobilise" desc="Respond to call-ups" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label, desc }: { href: string; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <Link href={href} className="panel p-4 hover:bg-[#101c33] transition-colors block">
      <span className="text-[var(--accent)]">{icon}</span>
      <div className="font-semibold mt-2">{label}</div>
      <div className="text-xs text-muted">{desc}</div>
    </Link>
  );
}
