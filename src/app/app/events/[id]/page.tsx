import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Panel } from "@/components/ui";
import QrBlock from "@/components/app/QrBlock";
import type { EventRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: ev } = await supabase.from("events").select("*").eq("id", id).single<EventRow>();
  if (!ev) notFound();

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host");
  const checkinUrl = `${proto}://${host}/app/checkin/${ev.qr_token}`;

  const db = createAdminClient();
  const { count } = await db
    .from("event_attendance")
    .select("*", { count: "exact", head: true })
    .eq("event_id", ev.id);

  return (
    <div className="space-y-6">
      <Link href="/app/events" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={16} /> Back to events
      </Link>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title={ev.title}>
          {ev.description && <p className="text-sm text-muted mb-4">{ev.description}</p>}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><CalendarDays size={15} className="text-muted" /> {new Date(ev.starts_at).toLocaleString()}</div>
            {ev.location && <div className="flex items-center gap-2"><MapPin size={15} className="text-muted" /> {ev.location}</div>}
            <div className="flex items-center gap-2"><Users size={15} className="text-muted" /> {count ?? 0} checked in · {ev.expected} expected</div>
          </div>
        </Panel>

        <Panel title="Attendance QR" subtitle="Display this at the venue — members scan to check in">
          <div className="flex flex-col items-center gap-3 py-2">
            <QrBlock value={checkinUrl} />
            <p className="text-xs text-muted break-all text-center max-w-[260px]">{checkinUrl}</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
