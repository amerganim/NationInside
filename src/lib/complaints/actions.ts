"use server";

import { revalidatePath } from "next/cache";
import { requireUser, requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ComplaintStatus } from "@/lib/supabase/types";

export async function submitComplaint(formData: FormData) {
  const { userId, profile } = await requireUser();
  const db = createAdminClient();

  const lat = formData.get("lat") ? Number(formData.get("lat")) : null;
  const lng = formData.get("lng") ? Number(formData.get("lng")) : null;

  const { error } = await db.from("complaints").insert({
    title: String(formData.get("title")).trim(),
    description: String(formData.get("description") || "") || null,
    category: String(formData.get("category") || "other"),
    photo_url: String(formData.get("photo_url") || "") || null,
    location: String(formData.get("location") || "") || null,
    lat,
    lng,
    org_node_id: profile?.org_node_id ?? null,
    submitted_by: userId,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/app/complaints");
}

export async function updateComplaintStatus(formData: FormData) {
  const { profile } = await requireAdmin();
  const id = String(formData.get("complaint_id"));
  const status = String(formData.get("status")) as ComplaintStatus;
  const db = createAdminClient();

  const patch: Record<string, string | null> = { status, updated_at: new Date().toISOString() };
  if (status === "assigned" || status === "in_progress") patch.assigned_to = profile!.id;

  const { error } = await db.from("complaints").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/app/complaints");
}
