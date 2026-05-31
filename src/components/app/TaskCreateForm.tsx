"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X } from "lucide-react";
import { createTask } from "@/lib/tasks/actions";
import type { OrgNode } from "@/lib/supabase/types";

const CATEGORIES = ["relief", "plantation", "blood", "rally", "survey", "recruitment", "other"];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
      {pending ? "Creating…" : "Create task"}
    </button>
  );
}

export default function TaskCreateForm({ districts }: { districts: OrgNode[] }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-border hover:bg-white/5">
        <Plus size={16} /> New task
      </button>
    );
  }
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Create task / mission</h3>
        <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground"><X size={18} /></button>
      </div>
      <form action={async (fd) => { await createTask(fd); setOpen(false); }} className="grid sm:grid-cols-2 gap-3">
        <L label="Title" className="sm:col-span-2"><input name="title" required placeholder="Tree plantation drive" className="inp" /></L>
        <L label="Category">
          <select name="category" className="inp">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        </L>
        <L label="Points"><input name="points" type="number" min="1" defaultValue="20" className="inp" /></L>
        <L label="Due date"><input name="due_at" type="date" className="inp" /></L>
        <L label="Committee">
          <select name="org_node_id" className="inp">
            <option value="national">National</option>
            {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </L>
        <L label="Description" className="sm:col-span-2"><textarea name="description" rows={2} className="inp" /></L>
        <div className="sm:col-span-2"><Submit /></div>
      </form>
      <style>{`.inp{margin-top:.25rem;width:100%;padding:.55rem .7rem;border-radius:.6rem;background:#0a1320;border:1px solid var(--border);font-size:.85rem;color:var(--foreground);outline:none}.inp:focus{border-color:var(--accent)}`}</style>
    </div>
  );
}

function L({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}
