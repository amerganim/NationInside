"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/profile/actions";
import { Avatar } from "@/components/ui";

export default function ProfileEditForm({
  userId,
  initial,
}: {
  userId: string;
  initial: { full_name: string; name_bn: string | null; phone: string | null; photo_url: string | null; initials: string };
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initial.full_name);
  const [nameBn, setNameBn] = useState(initial.name_bn ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [preview, setPreview] = useState<string | null>(initial.photo_url);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onPick(f: File | null) {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function save() {
    setBusy(true);
    setErr(null);
    setSaved(false);
    try {
      let photoUrl = "";
      if (file) {
        const supabase = createClient();
        const ext = file.name.split(".").pop() || "jpg";
        const path = `avatars/${userId}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("photos").upload(path, file, { upsert: true });
        if (error) throw new Error("Photo upload failed: " + error.message);
        photoUrl = supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
      }
      const fd = new FormData();
      fd.set("full_name", fullName);
      fd.set("name_bn", nameBn);
      fd.set("phone", phone);
      fd.set("photo_url", photoUrl);

      startTransition(async () => {
        await updateProfile(fd);
        setSaved(true);
        router.refresh();
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar initials={initial.initials} hue={200} size={72} src={preview} />
          <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full grid place-items-center bg-[var(--accent)] text-[#04130c] cursor-pointer">
            <Camera size={15} />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <div className="text-sm text-muted">Tap the camera to set your profile photo.<br />It appears on your Digital ID.</div>
      </div>

      <Field label="Full name"><input value={fullName} onChange={(e) => setFullName(e.target.value)} className="inp" /></Field>
      <Field label="Name in Bangla"><input value={nameBn} onChange={(e) => setNameBn(e.target.value)} placeholder="আপনার নাম" className="inp" /></Field>
      <Field label="Phone"><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+8801…" className="inp" /></Field>

      {err && <p className="text-sm text-[var(--danger)]">{err}</p>}

      <button onClick={save} disabled={busy || pending}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
        {(busy || pending) ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
        {saved ? "Saved" : "Save changes"}
      </button>

      <style>{`.inp{width:100%;padding:.6rem .75rem;border-radius:.7rem;background:#0d1626;border:1px solid var(--border);font-size:.9rem;color:var(--foreground);outline:none}.inp:focus{border-color:var(--accent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
