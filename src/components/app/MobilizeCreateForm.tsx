"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X } from "lucide-react";
import { createMobilization } from "@/lib/mobilize/actions";
import type { OrgNode } from "@/lib/supabase/types";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      style={{ background: "linear-gradient(135deg, var(--bd-red), #ff6a3d)" }}>
      {pending ? "Sending…" : "Issue call-up"}
    </button>
  );
}

export default function MobilizeCreateForm({ districts }: { districts: OrgNode[] }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-border hover:bg-white/5">
        <Plus size={16} /> New call-up
      </button>
    );
  }
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Issue a mobilisation</h3>
        <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground"><X size={18} /></button>
      </div>
      <form action={async (fd) => { await createMobilization(fd); setOpen(false); }} className="space-y-3">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">Title</span>
          <input name="title" required placeholder="Emergency gathering — Gazipur, 5 PM today"
            className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#0a1320] border border-border text-sm outline-none focus:border-[var(--accent)]" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">Target committee</span>
          <select name="org_node_id" className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#0a1320] border border-border text-sm outline-none focus:border-[var(--accent)]">
            <option value="national">National</option>
            {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
        <Submit />
      </form>
    </div>
  );
}
