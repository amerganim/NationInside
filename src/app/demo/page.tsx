import Link from "next/link";
import { Users, UserCheck, MapPin, CalendarDays, HeartHandshake, ArrowRight } from "lucide-react";
import { KpiCard } from "@/components/ui";
import DashboardClient from "@/components/DashboardClient";
import {
  getNational,
  getAllDistricts,
  getGrowthSeries,
  fmt,
  fmtCompact,
} from "@/lib/data";

export default function DashboardPage() {
  const nat = getNational();
  const districts = getAllDistricts();
  const growth = getGrowthSeries();

  const mapPoints = districts.map((d) => ({
    id: d.id,
    name: d.name,
    lat: d.lat,
    lng: d.lng,
    memberCount: d.memberCount,
    activeCount: d.activeCount,
    activityScore: d.activityScore,
  }));

  const inactive = nat.memberCount - nat.activeCount;
  const statusData = [
    { name: "Active members", value: nat.activeCount, color: "#16c784" },
    { name: "Inactive members", value: inactive, color: "#33425f" },
  ];

  const topDistricts = [...districts]
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 7)
    .map((d) => ({ name: d.name, members: d.memberCount }));

  const activePct = Math.round((nat.activeCount / nat.memberCount) * 100);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="panel p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(600px 200px at 90% 0%, rgba(22,199,132,.25), transparent)" }} />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
              National Command Dashboard
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">
              The whole party, in one screen.
            </h1>
            <p className="text-muted mt-2 max-w-xl">
              Real-time visibility across {fmt(64)} districts — see who is active,
              where you are strong, and where the organisation needs attention.
            </p>
          </div>
          <Link
            href="/demo/mobilize"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}
          >
            Mobilise the network <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Total Members" value={fmtCompact(nat.memberCount)} delta="↑ 4.2% this month" icon={<Users size={18} />} />
        <KpiCard label="Active Members" value={fmtCompact(nat.activeCount)} delta={`${activePct}% engagement`} icon={<UserCheck size={18} />} accent="var(--accent-2)" />
        <KpiCard label="Districts Covered" value={`64 / 64`} delta="Full national reach" icon={<MapPin size={18} />} accent="var(--warn)" />
        <KpiCard label="Volunteers" value={fmtCompact(nat.volunteerCount)} delta="↑ 1,840 this week" icon={<HeartHandshake size={18} />} accent="var(--bd-red)" />
        <KpiCard label="Upcoming Events" value="120" delta="across 38 districts" icon={<CalendarDays size={18} />} accent="var(--accent)" />
      </div>

      {/* Map + charts */}
      <DashboardClient
        mapPoints={mapPoints}
        growth={growth}
        statusData={statusData}
        topDistricts={topDistricts}
      />
    </div>
  );
}
