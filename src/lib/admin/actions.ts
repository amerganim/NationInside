"use server";

import { revalidatePath } from "next/cache";
import { getSession, isAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const { profile } = await getSession();
  if (!isAdmin(profile)) throw new Error("Not authorised");
  return profile!;
}

export async function approveMember(formData: FormData) {
  const admin = await requireAdmin();
  const memberId = String(formData.get("member_id"));
  const orgNodeId = String(formData.get("org_node_id") || "") || null;
  const designation = String(formData.get("designation") || "Member");

  const db = createAdminClient();
  const { error } = await db
    .from("profiles")
    .update({
      status: "active",
      org_node_id: orgNodeId,
      designation,
      verified_by: admin.id,
      verified_at: new Date().toISOString(),
    })
    .eq("id", memberId);
  if (error) throw new Error(error.message);

  // Welcome points on verification.
  await db.from("score_events").insert({ member_id: memberId, source: "manual", points: 5 });
  revalidatePath("/app/admin");
}

export async function setMemberStatus(formData: FormData) {
  await requireAdmin();
  const memberId = String(formData.get("member_id"));
  const status = String(formData.get("status")) as "active" | "suspended" | "pending";
  const db = createAdminClient();
  const { error } = await db.from("profiles").update({ status }).eq("id", memberId);
  if (error) throw new Error(error.message);
  revalidatePath("/app/admin");
}
