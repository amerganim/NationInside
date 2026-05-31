"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { POINTS } from "@/lib/scoring";

export async function createEvent(formData: FormData) {
  const { profile } = await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("events").insert({
    title: String(formData.get("title")).trim(),
    description: String(formData.get("description") || "") || null,
    location: String(formData.get("location") || "") || null,
    org_node_id: String(formData.get("org_node_id") || "") || profile?.org_node_id || null,
    starts_at: new Date(String(formData.get("starts_at"))).toISOString(),
    expected: Number(formData.get("expected") || 0),
    created_by: profile!.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/app/events");
}

/** Check the signed-in member into an event (idempotent). Awards attendance points. */
export async function checkInAction(formData: FormData): Promise<void> {
  const eventId = String(formData.get("event_id"));
  const { userId } = await requireUser();
  const db = createAdminClient();

  const { data: ev } = await db.from("events").select("id").eq("id", eventId).single();
  if (!ev) throw new Error("Event not found");

  const { error } = await db
    .from("event_attendance")
    .insert({ event_id: eventId, member_id: userId, method: "qr" });

  if (error) {
    if (error.code === "23505") {
      revalidatePath("/app/events");
      return; // already checked in — no double points
    }
    throw new Error(error.message);
  }

  await db.from("score_events").insert({
    member_id: userId,
    source: "attendance",
    points: POINTS.eventAttendance,
    ref_id: eventId,
  });
  revalidatePath("/app/events");
}
