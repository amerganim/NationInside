import Link from "next/link";
import { Clock, Target, CalendarDays, Megaphone, TrendingUp, Pencil, Award, CalendarCheck, Lock } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Panel, ScoreBar, scoreColor } from "@/components/ui";
import MemberIdCard from "@/components/app/MemberIdCard";
import { rankProgress, computeBadges, tierColor, type BadgeProgress } from "@/lib/gamification";
import { getLocale } from "@/lib/i18n/server";
import { t as translate } from "@/lib/i18n/dict";

export const dynamic = "force-dynamic";

const BADGE_ICON: Record<string, React.ElementType> = {
  CalendarCheck,
  Target,
  Megaphone,
};

export default async function MemberHome() {
  const { userId, email, profile, orgNode } = await getSession();
  const name = profile?.full_name || email || "Member";
  const pending = profile?.status !== "active";
  const score = profile?.activity_score ?? 0;

  // Member's own contribution counts from the score ledger (RLS-scoped to self).
  const supabase = await createClient();
  const { data: scoreRows } = await supabase.from("score_events").select("source");
  const counts = { attendance: 0, task: 0, mobilization: 0 };
  for (const r of (scoreRows ?? []) as { source: string }[]) {
    if (r.source === "attendance") counts.attendance++;
    else if (r.source === "task") counts.task++;
    else if (r.source === "mobilization") counts.mobilization++;
  }

  const { current, next, pct } = rankProgress(score);
  const badges = computeBadges(counts);
  const locale = await getLocale();
  const t = (k: string) => translate(k, locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("home.welcome")}, {name.split(" ")[0]} 👋</h1>
        <p className="text-muted mt-1">{t("home.subtitle")}</p>
      </div>

      {pending && (
        <div className="panel p-5 border-l-4 flex items-start gap-3" style={{ borderLeftColor: "var(--warn)" }}>
          <Clock size={20} className="text-[var(--warn)] mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold">{t("home.pendingTitle")}</div>
            <p className="text-sm text-muted mt-1">
              {t("home.pendingBody")}
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
            <Pencil size={14} /> {t("chrome.editProfile")}
          </Link>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Panel title={t("home.activityScore")} subtitle={t("home.activityScoreSub")}>
            <div className="flex items-end justify-between mb-2">
              <span className="text-4xl font-bold" style={{ color: scoreColor(score) }}>{score}</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full"
                style={{ background: `${current.color}22`, color: current.color }}>
                <Award size={14} /> {current.name}
              </span>
            </div>
            <ScoreBar score={score} />
            <div className="flex items-center gap-1 mt-2 text-xs text-muted">
              <TrendingUp size={12} />
              {next ? <>{pct}% {t("home.towards")} <span className="text-foreground font-medium">{next.name}</span></> : t("home.maxRank")}
            </div>
          </Panel>

          <Panel title={t("home.achievements")} subtitle={t("home.achievementsSub")}>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((b) => <BadgeCard key={b.key} badge={b} />)}
            </div>
          </Panel>

          <div className="grid sm:grid-cols-3 gap-4">
            <QuickLink href="/app/tasks" icon={<Target size={20} />} label={t("home.myTasks")} desc={t("home.myTasksDesc")} />
            <QuickLink href="/app/events" icon={<CalendarDays size={20} />} label={t("nav.events")} desc={t("home.eventsDesc")} />
            <QuickLink href="/app/mobilize" icon={<Megaphone size={20} />} label={t("nav.mobilize")} desc={t("home.mobilizeDesc")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ badge }: { badge: BadgeProgress }) {
  const Icon = BADGE_ICON[badge.icon] ?? Award;
  const earned = badge.tier > 0;
  const color = tierColor(badge.tier);
  return (
    <div className="rounded-xl border border-border bg-[#0d1626] p-3 text-center">
      <div className="w-12 h-12 rounded-full grid place-items-center mx-auto"
        style={{ background: `${color}22`, color: earned ? color : "var(--muted)" }}>
        {earned ? <Icon size={22} /> : <Lock size={18} />}
      </div>
      <div className="text-xs font-medium mt-2 truncate">{badge.name}</div>
      <div className="text-[11px]" style={{ color: earned ? color : "var(--muted)" }}>{badge.tierName}</div>
      <div className="text-[10px] text-muted mt-0.5">
        {badge.next ? `${badge.count}/${badge.next}` : `${badge.count} · max`}
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
