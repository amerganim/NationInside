"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X } from "lucide-react";
import { createMobilization } from "@/lib/mobilize/actions";
import { useT } from "@/lib/i18n/client";
import type { OrgNode } from "@/lib/supabase/types";

function Submit() {
  const { pending } = useFormStatus();
  const t = useT();
  return (
    <button disabled={pending} className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      style={{ background: "linear-gradient(135deg, var(--bd-red), #ff6a3d)" }}>
      {pending ? t("mobForm.sending") : t("mobForm.submit")}
    </button>
  );
}

export default function MobilizeCreateForm({ districts }: { districts: OrgNode[] }) {
  const [open, setOpen] = useState(false);
  const t = useT();
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-border hover:bg-white/5">
        <Plus size={16} /> {t("mobilize.new")}
      </button>
    );
  }
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{t("mobForm.heading")}</h3>
        <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground"><X size={18} /></button>
      </div>
      <form action={async (fd) => { await createMobilization(fd); setOpen(false); }} className="space-y-3">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">{t("form.title")}</span>
          <input name="title" required placeholder="Emergency gathering — Gazipur, 5 PM today"
            className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#0a1320] border border-border text-sm outline-none focus:border-[var(--accent)]" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">{t("mobForm.target")}</span>
          <select name="org_node_id" className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#0a1320] border border-border text-sm outline-none focus:border-[var(--accent)]">
            <option value="national">{t("form.national")}</option>
            {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
        <Submit />
      </form>
    </div>
  );
}
