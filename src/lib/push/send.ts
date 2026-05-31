import "server-only";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

let configured = false;
function configure(): boolean {
  if (configured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:admin@nationinside.app", pub, priv);
  configured = true;
  return true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

/**
 * Send a web-push to every subscriber under an org node (null/"national" = everyone).
 * Best-effort: failures and dead subscriptions are pruned, never thrown.
 */
export async function sendPushToOrg(orgNodeId: string | null, payload: PushPayload): Promise<void> {
  if (!configure()) return;
  const db = createAdminClient();

  let query = db.from("push_subscriptions").select("endpoint, p256dh, auth");
  if (orgNodeId && orgNodeId !== "national") {
    query = query.like("org_node_id", `${orgNodeId}%`);
  }
  const { data: subs } = await query;
  if (!subs?.length) return;

  const body = JSON.stringify(payload);
  await Promise.allSettled(
    subs.map((s: { endpoint: string; p256dh: string; auth: string }) =>
      webpush
        .sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, body)
        .catch(async (err: { statusCode?: number }) => {
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            await db.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
          }
        }),
    ),
  );
}
