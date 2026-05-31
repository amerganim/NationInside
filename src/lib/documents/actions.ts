"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createDocument(formData: FormData) {
  const { profile } = await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("documents").insert({
    title: String(formData.get("title")).trim(),
    description: String(formData.get("description") || "") || null,
    file_url: String(formData.get("file_url")),
    file_name: String(formData.get("file_name") || "") || null,
    file_type: String(formData.get("file_type") || "") || null,
    org_node_id: String(formData.get("org_node_id") || "") || profile?.org_node_id || null,
    uploaded_by: profile!.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/app/documents");
}

export async function deleteDocument(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("document_id"));
  const db = createAdminClient();
  const { error } = await db.from("documents").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/app/documents");
}
