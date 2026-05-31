"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, BellOff, Loader2 } from "lucide-react";
import { saveSubscription } from "@/lib/push/actions";
import { useT } from "@/lib/i18n/client";

function urlB64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

type State = "loading" | "unsupported" | "default" | "denied" | "subscribed" | "working";

export default function EnableNotifications() {
  const [state, setState] = useState<State>("loading");
  const [err, setErr] = useState<string | null>(null);
  const t = useT();

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") { setState("denied"); return; }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setState(sub ? "subscribed" : "default"))
      .catch(() => setState("default"));
  }, []);

  async function enable() {
    setErr(null);
    setState("working");
    try {
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) throw new Error("Push not configured");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") { setState(permission === "denied" ? "denied" : "default"); return; }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(key),
      });
      await saveSubscription(sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } });
      setState("subscribed");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not enable notifications");
      setState("default");
    }
  }

  if (state === "loading" || state === "unsupported") return null;

  if (state === "subscribed") {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--accent)]">
        <BellRing size={16} /> {t("notif.on")}
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <BellOff size={16} /> {t("notif.blocked")}
      </div>
    );
  }

  return (
    <div>
      <button onClick={enable} disabled={state === "working"}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-border hover:bg-white/5 disabled:opacity-60">
        {state === "working" ? <Loader2 size={16} className="animate-spin" /> : <Bell size={16} />}
        {t("notif.enable")}
      </button>
      {err && <p className="text-xs text-[var(--danger)] mt-1">{err}</p>}
    </div>
  );
}
