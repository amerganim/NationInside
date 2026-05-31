import Link from "next/link";
import { CalendarDays, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkInAction } from "@/lib/events/actions";
import { Panel } from "@/components/ui";
import type { EventRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function CheckinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { userId, profile } = await getSession();

  const db = createAdminClient();
  const { data: ev } = await db.from("events").select("*").eq("qr_token", token).single<EventRow>();

  if (!ev) {
    return (
      <Panel><div className="text-center py-8"><AlertTriangle className="mx-auto text-[var(--warn)] mb-2" /><p>Invalid or expired check-in code.</p></div></Panel>
    );
  }

  const { data: existing } = userId
    ? await db.from("event_attendance").select("id").eq("event_id", ev.id).eq("member_id", userId).maybeSingle()
    : { data: null };

  const active = profile?.status === "active";

  return (
    <div className="max-w-md mx-auto">
      <Panel title="Event Check-in">
        <h2 className="text-xl font-bold">{ev.title}</h2>
        <div className="mt-3 space-y-2 text-sm text-muted">
          <div className="flex items-center gap-2"><CalendarDays size={15} /> {new Date(ev.starts_at).toLocaleString()}</div>
          {ev.location && <div className="flex items-center gap-2"><MapPin size={15} /> {ev.location}</div>}
        </div>

        <div className="mt-5">
          {existing ? (
            <div className="flex items-center gap-2 text-[var(--accent)] font-medium">
              <CheckCircle2 size={18} /> You're checked in. See you there!
            </div>
          ) : !active ? (
            <p className="text-sm text-[var(--warn)]">Your membership must be verified before you can check in.</p>
          ) : (
            <form action={checkInAction}>
              <input type="hidden" name="event_id" value={ev.id} />
              <button className="w-full rounded-xl py-3 font-semibold text-white" style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
                Confirm check-in (+10 points)
              </button>
            </form>
          )}
        </div>

        <Link href="/app/events" className="block text-center text-sm text-muted hover:text-foreground mt-4">
          Back to events
        </Link>
      </Panel>
    </div>
  );
}
