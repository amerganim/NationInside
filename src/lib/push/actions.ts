"use server";

import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export interface PushSubJSON {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function saveSubscription(sub: PushSubJSON) {
  const { userId, profile } = await requireUser();
  if (!sub?.endpoint || !sub.keys) throw new Error("Invalid subscription");
  const db = createAdminClient();
  const { error } = await db.from("push_subscriptions").upsert(
    {
      member_id: userId,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      org_node_id: profile?.org_node_id ?? null,
    },
    { onConflict: "endpoint" },
  );
  if (error) throw new Error(error.message);
}

export async function removeSubscription(endpoint: string) {
  await requireUser();
  const db = createAdminClient();
  await db.from("push_subscriptions").delete().eq("endpoint", endpoint);
}
