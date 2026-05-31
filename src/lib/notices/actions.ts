"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPushToOrg } from "@/lib/push/send";

export async function createNotice(formData: FormData) {
  const { profile } = await requireAdmin();
  const db = createAdminClient();
  const title = String(formData.get("title")).trim();
  const body = String(formData.get("body") || "") || null;
  const orgNodeId = String(formData.get("org_node_id") || "") || profile?.org_node_id || null;

  const { error } = await db.from("notices").insert({
    title,
    body,
    pinned: formData.get("pinned") === "on",
    org_node_id: orgNodeId,
    created_by: profile!.id,
  });
  if (error) throw new Error(error.message);

  await sendPushToOrg(orgNodeId, {
    title: `📢 ${title}`,
    body: body ?? "New notice from party leadership",
    url: "/app/notices",
    tag: "notice",
  });

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
