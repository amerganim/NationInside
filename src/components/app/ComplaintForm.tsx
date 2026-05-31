"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Upload, MapPin, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { submitComplaint } from "@/lib/complaints/actions";
import { useT } from "@/lib/i18n/client";

const CATEGORIES = [
  ["road", "Road"], ["water", "Water"], ["electricity", "Electricity"],
  ["sanitation", "Sanitation"], ["safety", "Safety"], ["other", "Other"],
];

export default function ComplaintForm() {
  const t = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function getLocation(): Promise<{ lat: number | null; lng: number | null }> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({ lat: null, lng: null });
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve({ lat: null, lng: null }),
        { timeout: 6000 },
      );
    });
  }

  async function handle(form: HTMLFormElement) {
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData(form);
      const { lat, lng } = await getLocation();
      if (lat != null) fd.set("lat", String(lat));
      if (lng != null) fd.set("lng", String(lng));

      if (file) {
        const supabase = createClient();
        const path = `complaints/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error } = await supabase.storage.from("photos").upload(path, file);
        if (error) throw new Error("Photo upload failed: " + error.message);
        fd.set("photo_url", supabase.storage.from("photos").getPublicUrl(path).data.publicUrl);
      }

      startTransition(async () => {
        await submitComplaint(fd);
        setOpen(false);
        setFile(null);
        router.refresh();
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not submit");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
        style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
        <Plus size={16} /> {t("complaints.report")}
      </button>
    );
  }

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Report a local issue</h3>
        <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground"><X size={18} /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handle(e.currentTarget); }} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted">Category</span>
            <select name="category" className="inp">{CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted">Location (area)</span>
            <input name="location" placeholder="e.g. Kaliganj bazar road" className="inp" />
          </label>
        </div>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">Title</span>
          <input name="title" required placeholder="Broken road near the school" className="inp" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">Details</span>
          <textarea name="description" rows={3} placeholder="Describe the problem…" className="inp" />
        </label>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
            <Upload size={14} /> {file ? file.name : "Attach photo (optional)"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <span className="flex items-center gap-1 text-[11px] text-muted"><MapPin size={12} /> location captured on submit</span>
        </div>
        {err && <p className="text-sm text-[var(--danger)]">{err}</p>}
        <button disabled={busy || pending} className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
          {(busy || pending) && <Loader2 size={15} className="animate-spin" />} Submit complaint
        </button>
      </form>
      <style>{`.inp{margin-top:.25rem;width:100%;padding:.55rem .7rem;border-radius:.6rem;background:#0a1320;border:1px solid var(--border);font-size:.85rem;color:var(--foreground);outline:none}.inp:focus{border-color:var(--accent)}`}</style>
    </div>
  );
}
