"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createDocument } from "@/lib/documents/actions";
import { useT } from "@/lib/i18n/client";

export default function DocumentUploadForm() {
  const t = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handle(form: HTMLFormElement) {
    if (!file) { setErr("Please choose a file"); return; }
    setBusy(true);
    setErr(null);
    try {
      const supabase = createClient();
      const path = `documents/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error } = await supabase.storage.from("photos").upload(path, file);
      if (error) throw new Error("Upload failed: " + error.message);
      const url = supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;

      const fd = new FormData(form);
      fd.set("file_url", url);
      fd.set("file_name", file.name);
      fd.set("file_type", file.type || file.name.split(".").pop() || "");

      startTransition(async () => {
        await createDocument(fd);
        setOpen(false);
        setFile(null);
        router.refresh();
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not upload");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-border hover:bg-white/5">
        <Plus size={16} /> {t("documents.upload")}
      </button>
    );
  }

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{t("docForm.heading")}</h3>
        <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground"><X size={18} /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handle(e.currentTarget); }} className="space-y-3">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">{t("form.title")}</span>
          <input name="title" required placeholder="Party Constitution 2026" className="inp" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">{t("form.description")}</span>
          <textarea name="description" rows={2} className="inp" />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
          <Upload size={15} /> {file ? file.name : t("form.chooseFile")}
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        {err && <p className="text-sm text-[var(--danger)]">{err}</p>}
        <button disabled={busy || pending} className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
          {(busy || pending) && <Loader2 size={15} className="animate-spin" />} {t("docForm.publish")}
        </button>
      </form>
      <style>{`.inp{margin-top:.25rem;width:100%;padding:.55rem .7rem;border-radius:.6rem;background:#0a1320;border:1px solid var(--border);font-size:.85rem;color:var(--foreground);outline:none}.inp:focus{border-color:var(--accent)}`}</style>
    </div>
  );
}
