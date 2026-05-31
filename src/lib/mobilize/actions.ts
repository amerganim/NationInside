"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { POINTS } from "@/lib/scoring";

export async function createMobilization(formData: FormData) {
  const { profile } = await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("mobilizations").insert({
    title: String(formData.get("title")).trim(),
    org_node_id: String(formData.get("org_node_id") || "") || profile?.org_node_id || null,
    created_by: profile!.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/app/mobilize");
}

/** Member responds to a call-up. First positive response awards points. */
export async function respondMobilization(formData: FormData) {
  const mobId = String(formData.get("mobilization_id"));
  const response = String(formData.get("response")) as "coming" | "enroute" | "declined";
  const { userId } = await requireUser();
  const db = createAdminClient();

  const { data: existing } = await db
    .from("mobilization_responses")
    .select("id")
    .eq("mobilization_id", mobId)
    .eq("member_id", userId)
    .maybeSingle();

  if (existing) {
    await db.from("mobilization_responses")
      .update({ response, responded_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await db.from("mobilization_responses").insert({ mobilization_id: mobId, member_id: userId, response });
    if (response === "coming" || response === "enroute") {
      await db.from("score_events").insert({
        member_id: userId,
        source: "mobilization",
        points: POINTS.mobilizationResponse,
        ref_id: mobId,
      });
    }
  }
  revalidatePath("/app/mobilize");
}
