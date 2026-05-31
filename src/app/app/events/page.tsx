import Link from "next/link";
import { CalendarDays, MapPin, Users, CheckCircle2, QrCode } from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkInAction } from "@/lib/events/actions";
import { Panel, Badge } from "@/components/ui";
import EventCreateForm from "@/components/app/EventCreateForm";
import { getT } from "@/lib/i18n/server";
import type { EventRow, OrgNode } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const { profile } = await getSession();
  const admin = isAdmin(profile);
  const active = profile?.status === "active";
  const t = await getT();

  const supabase = await createClient();
  const [{ data: events }, { data: myAtt }] = await Promise.all([
    supabase.from("events").select("*").order("starts_at", { ascending: true }),
    supabase.from("event_attendance").select("event_id"),
  ]);
  const eventList = (events ?? []) as EventRow[];
  const attended = new Set((myAtt ?? []).map((a: { event_id: string }) => a.event_id));

  // Attendance counts (service role — counts aren't readable by members via RLS).
  const db = createAdminClient();
  const { data: allAtt } = await db.from("event_attendance").select("event_id");
  const counts = new Map<string, number>();
  for (const a of (allAtt ?? []) as { event_id: string }[]) counts.set(a.event_id, (counts.get(a.event_id) ?? 0) + 1);

  let districts: OrgNode[] = [];
  if (admin) {
    const { data } = await db.from("org_nodes").select("*").eq("level", "district").order("name");
    districts = (data ?? []) as OrgNode[];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{t("events.title")}</h1>
          <p className="text-muted mt-1">{t("events.subtitle")}</p>
        </div>
        {admin && <EventCreateForm districts={districts} />}
      </div>

      {eventList.length === 0 ? (
        <Panel><p className="text-sm text-muted py-8 text-center">{t("events.empty")}</p></Panel>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {eventList.map((ev) => {
            const isAttended = attended.has(ev.id);
            const when = new Date(ev.starts_at);
            return (
              <div key={ev.id} className="panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-lg">{ev.title}</h3>
                  {isAttended && <Badge color="var(--accent)"><CheckCircle2 size={11} /> {t("events.checkedIn")}</Badge>}
                </div>
                {ev.description && <p className="text-sm text-muted mt-1 line-clamp-2">{ev.description}</p>}
                <div className="mt-3 space-y-1.5 text-sm text-muted">
                  <div className="flex items-center gap-2"><CalendarDays size={14} /> {when.toLocaleString()}</div>
                  {ev.location && <div className="flex items-center gap-2"><MapPin size={14} /> {ev.location}</div>}
                  <div className="flex items-center gap-2"><Users size={14} /> {counts.get(ev.id) ?? 0} {t("events.checkedInCount")} · {ev.expected} {t("events.expected")}</div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {active && !isAttended && (
                    <form action={checkInAction}>
                      <input type="hidden" name="event_id" value={ev.id} />
                      <button className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
                        {t("events.checkin")} (+10)
                      </button>
                    </form>
                  )}
                  {isAttended && <span className="text-sm text-[var(--accent)]">✓ {t("events.recorded")}</span>}
                  <Link href={`/app/events/${ev.id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground ml-auto">
                    <QrCode size={15} /> QR
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
