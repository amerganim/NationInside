"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createNotice(formData: FormData) {
  const { profile } = await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("notices").insert({
    title: String(formData.get("title")).trim(),
    body: String(formData.get("body") || "") || null,
    pinned: formData.get("pinned") === "on",
    org_node_id: String(formData.get("org_node_id") || "") || profile?.org_node_id || null,
    created_by: profile!.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/app/notices");
  revalidatePath("/app");
}

export async function deleteNotice(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("notice_id"));
  const db = createAdminClient();
  const { error } = await db.from("notices").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/app/notices");
}
