import { redirect } from "next/navigation";
import { Users, UserCheck, Clock, CalendarDays, Target, Award, Trophy, Activity } from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth/session";
import { getInsights } from "@/lib/insights/queries";
import { KpiCard, Panel, Avatar, ScoreBar, scoreColor } from "@/components/ui";
import { StatusDonut, DistrictsBar, EngagementTrend, InsightsMap } from "@/components/app/InsightsCharts";
import { rankFor } from "@/lib/gamification";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

const SOURCE_LABEL: Record<string, string> = {
  attendance: "checked in to an event",
  task: "completed a mission",
  mobilization: "answered a call-up",
  manual: "was verified",
};

export default async function InsightsPage() {
  const { profile } = await getSession();
  if (!isAdmin(profile)) redirect("/app");

  const d = await getInsights();
  const t = await getT();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("insights.title")}</h1>
        <p className="text-muted mt-1">{t("insights.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Members" value={d.totalMembers} icon={<Users size={18} />} />
        <KpiCard label="Active" value={d.activeMembers} delta={`${d.pendingMembers} pending`} icon={<UserCheck size={18} />} accent="var(--accent-2)" />
        <KpiCard label="Events" value={d.eventsCount} delta={`${d.checkIns} check-ins`} icon={<CalendarDays size={18} />} accent="var(--warn)" />
        <KpiCard label="Points Awarded" value={d.totalPoints} delta={`${d.tasksApproved} tasks done`} icon={<Award size={18} />} accent="var(--bd-red)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Engagement Trend" subtitle="Activity events & new members · last 30 days">
          <EngagementTrend data={d.trend} />
        </Panel>
        <Panel title="District Coverage" subtitle="Members per committee · colour = health">
          <InsightsMap points={d.mapPoints} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Member Status" subtitle="Live verification breakdown">
          <StatusDonut data={d.statusBreakdown} />
          <div className="space-y-2 mt-2">
            {d.statusBreakdown.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted"><i className="w-3 h-3 rounded-sm inline-block" style={{ background: s.color }} />{s.name}</span>
                <span className="font-semibold tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="lg:col-span-2" title="Members by District" subtitle="Active members per committee">
          <DistrictsBar data={d.topDistricts} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Top Volunteers" subtitle="By live activity score" action={<Trophy size={16} className="text-[var(--warn)]" />}>
          {d.topVolunteers.length === 0 ? (
            <p className="text-sm text-muted py-6 text-center">No active members yet.</p>
          ) : (
            <ul className="space-y-2">
              {d.topVolunteers.map((m, i) => (
                <li key={m.id} className="flex items-center gap-3">
                  <span className="w-5 text-center text-sm font-bold text-muted">{i + 1}</span>
                  <Avatar initials={(m.name.split(" ").map((w) => w[0]).slice(0, 2).join("") || "M").toUpperCase()} hue={200} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-xs truncate" style={{ color: rankFor(m.score).color }}>{rankFor(m.score).name}</div>
                  </div>
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-0.5"><span className="text-muted">Score</span><span className="font-bold" style={{ color: scoreColor(m.score) }}>{m.score}</span></div>
                    <ScoreBar score={m.score} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Activity" subtitle="Latest contributions across the party" action={<Activity size={16} className="text-[var(--accent)]" />}>
          {d.recent.length === 0 ? (
            <p className="text-sm text-muted py-6 text-center">No activity recorded yet — create an event or task to get started.</p>
          ) : (
            <ul className="space-y-3">
              {d.recent.map((r, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg grid place-items-center bg-white/5 text-[var(--accent)] shrink-0"><Target size={15} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm truncate"><b>{r.name}</b> {SOURCE_LABEL[r.source] ?? r.source}</div>
                    <div className="text-xs text-muted">{new Date(r.when).toLocaleString()}</div>
                  </div>
                  <span className="text-sm font-semibold text-[var(--accent)] shrink-0">+{r.points}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
