"use client";

import { useState, useTransition } from "react";
import { MapPin, Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { submitTask } from "@/lib/tasks/actions";

export default function TaskSubmitForm({ assignmentId }: { assignmentId: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function getLocation(): Promise<{ lat: number | null; lng: number | null }> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({ lat: null, lng: null });
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve({ lat: null, lng: null }),
        { timeout: 6000 },
      );
    });
  }

  async function handleSubmit() {
    setBusy(true);
    setErr(null);
    try {
      const { lat, lng } = await getLocation();

      let photoUrl = "";
      if (file) {
        const supabase = createClient();
        const path = `tasks/${assignmentId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error } = await supabase.storage.from("photos").upload(path, file, { upsert: false });
        if (error) throw new Error("Photo upload failed: " + error.message);
        photoUrl = supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
      }

      const fd = new FormData();
      fd.set("assignment_id", assignmentId);
      fd.set("note", note);
      fd.set("photo_url", photoUrl);
      if (lat != null) fd.set("lat", String(lat));
      if (lng != null) fd.set("lng", String(lng));

      startTransition(async () => {
        await submitTask(fd);
        setOpen(false);
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
        style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
        Submit proof
      </button>
    );
  }

  return (
    <div className="mt-3 p-3 rounded-lg bg-[#0a1320] border border-border space-y-2">
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Describe what you did…"
        className="w-full px-2.5 py-2 rounded-lg bg-[#0d1626] border border-border text-sm outline-none focus:border-[var(--accent)]" />
      <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
        <Upload size={14} /> {file ? file.name : "Attach photo (optional)"}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      <div className="flex items-center gap-1 text-[11px] text-muted"><MapPin size={12} /> Your location is captured on submit</div>
      {err && <p className="text-xs text-[var(--danger)]">{err}</p>}
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={busy || pending} className="rounded-lg px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60 inline-flex items-center gap-1.5"
          style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
          {(busy || pending) && <Loader2 size={13} className="animate-spin" />} Submit
        </button>
        <button onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-sm text-muted border border-border">Cancel</button>
      </div>
    </div>
  );
}
