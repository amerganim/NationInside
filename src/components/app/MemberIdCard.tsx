"use client";

import { QRCodeSVG } from "qrcode.react";
import { BadgeCheck, Clock } from "lucide-react";
import { Avatar } from "@/components/ui";

export default function MemberIdCard({
  id,
  name,
  nameBn,
  designation,
  orgName,
  status,
  joinedAt,
  photoUrl,
}: {
  id: string;
  name: string;
  nameBn?: string | null;
  designation: string;
  orgName: string;
  status: string;
  joinedAt: string;
  photoUrl?: string | null;
}) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "M";
  const verified = status === "active";
  const shortId = "BD-" + id.slice(0, 8).toUpperCase();
  return (
    <div className="w-full max-w-[360px] rounded-2xl overflow-hidden shadow-2xl border border-border"
      style={{ background: "linear-gradient(160deg,#0e1a2c,#0a1320)" }}>
      <div className="px-5 pt-4 pb-3 relative" style={{ background: "linear-gradient(135deg,var(--bd-green),#024)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center font-bold text-white bg-white/15">N</div>
          <div className="leading-tight">
            <div className="text-white font-bold text-sm">Bangladesh National Party</div>
            <div className="text-white/70 text-[10px] uppercase tracking-widest">Digital Member ID</div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <span className="flex-1" style={{ background: "var(--bd-green)" }} />
          <span className="flex-1" style={{ background: "var(--bd-red)" }} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4">
          <Avatar initials={initials} hue={200} size={64} src={photoUrl} />
          <div className="min-w-0">
            <div className="font-bold text-lg leading-tight truncate">{name}</div>
            {nameBn && <div className="text-muted text-sm truncate">{nameBn}</div>}
            <div className="mt-1 inline-flex items-center gap-1 text-xs">
              {verified ? (
                <span className="inline-flex items-center gap-1 text-[var(--accent)]"><BadgeCheck size={14} /> Verified member</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[var(--warn)]"><Clock size={14} /> Pending verification</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-5 text-sm">
          <F label="Designation" value={designation} />
          <F label="Committee" value={orgName} />
          <F label="Member ID" value={shortId} mono />
          <F label="Joined" value={joinedAt.slice(0, 10)} mono />
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
          <div className="text-xs text-muted max-w-[170px]">Scan to verify at any event entry or checkpoint.</div>
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG value={`https://nation-inside.vercel.app/verify/${id}`} size={72} level="M" />
          </div>
        </div>
      </div>
    </div>
  );
}

function F({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`font-medium truncate ${mono ? "font-mono text-[13px]" : ""}`}>{value}</div>
    </div>
  );
}
