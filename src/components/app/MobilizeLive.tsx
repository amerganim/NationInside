"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Megaphone, Navigation, Check, X, Radio } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { respondMobilization } from "@/lib/mobilize/actions";
import { useT } from "@/lib/i18n/client";

type Resp = "coming" | "enroute" | "declined";

export default function MobilizeLive({
  mobilizationId,
  title,
  createdAt,
  initial,
  myUserId,
  active,
}: {
  mobilizationId: string;
  title: string;
  createdAt: string;
  initial: { member_id: string; response: Resp }[];
  myUserId: string;
  active: boolean;
}) {
  const [responses, setResponses] = useState<Record<string, Resp>>(
    () => Object.fromEntries(initial.map((r) => [r.member_id, r.response])),
  );

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`mob-${mobilizationId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mobilization_responses", filter: `mobilization_id=eq.${mobilizationId}` },
        (payload) => {
          const row = (payload.new ?? payload.old) as { member_id: string; response: Resp };
          if (row?.member_id) setResponses((prev) => ({ ...prev, [row.member_id]: row.response }));
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [mobilizationId]);

  const counts = useMemo(() => {
    let coming = 0, enroute = 0, declined = 0;
    for (const r of Object.values(responses)) {
      if (r === "coming") coming++;
      else if (r === "enroute") enroute++;
      else declined++;
    }
    return { coming, enroute, declined, responded: coming + enroute };
  }, [responses]);

  const mine = responses[myUserId];
  const t = useT();

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg grid place-items-center text-white" style={{ background: "linear-gradient(135deg, var(--bd-red), #ff6a3d)" }}>
            <Megaphone size={17} />
          </span>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="text-xs text-muted">{new Date(createdAt).toLocaleString()}</div>
          </div>
        </div>
        <span className="text-xs text-muted flex items-center gap-1"><Radio size={12} className="text-[var(--accent)]" /> live</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <LiveStat label={t("mobilize.statComing")} value={counts.coming} color="var(--accent)" />
        <LiveStat label={t("mobilize.statEnroute")} value={counts.enroute} color="var(--warn)" />
        <LiveStat label={t("mobilize.statResponded")} value={counts.responded} color="var(--accent-2)" />
      </div>

      {active ? (
        <div className="flex flex-wrap gap-2">
          <RespondBtn mobId={mobilizationId} value="coming" current={mine} icon={<Check size={15} />} label={t("mobilize.coming")} activeColor="var(--accent)" />
          <RespondBtn mobId={mobilizationId} value="enroute" current={mine} icon={<Navigation size={15} />} label={t("mobilize.enroute")} activeColor="var(--warn)" />
          <RespondBtn mobId={mobilizationId} value="declined" current={mine} icon={<X size={15} />} label={t("mobilize.cant")} activeColor="var(--danger)" />
        </div>
      ) : (
        <p className="text-xs text-[var(--warn)]">{t("mobilize.verifyRespond")}</p>
      )}
    </div>
  );
}

function LiveStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl bg-[#0d1626] border border-border p-3 text-center">
      <motion.div key={value} initial={{ scale: 1.3, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl font-bold tabular-nums" style={{ color }}>
        {value}
      </motion.div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

function RespondBtn({
  mobId, value, current, icon, label, activeColor,
}: {
  mobId: string; value: Resp; current?: Resp; icon: React.ReactNode; label: string; activeColor: string;
}) {
  const selected = current === value;
  return (
    <form action={respondMobilization}>
      <input type="hidden" name="mobilization_id" value={mobId} />
      <input type="hidden" name="response" value={value} />
      <button
        className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium border transition-colors"
        style={selected
          ? { background: activeColor, borderColor: activeColor, color: "#04130c" }
          : { borderColor: "var(--border)", color: "var(--foreground)" }}
      >
        {icon} {label}
      </button>
    </form>
  );
}
