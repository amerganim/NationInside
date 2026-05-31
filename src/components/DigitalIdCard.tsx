"use client";

import { QRCodeSVG } from "qrcode.react";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import { Avatar } from "@/components/ui";
import type { Member } from "@/lib/data";

export default function DigitalIdCard({ member }: { member: Member }) {
  const verifyUrl = `https://nationinside.app/verify/${member.id}`;
  return (
    <div
      className="w-full max-w-[360px] rounded-2xl overflow-hidden shadow-2xl border border-border"
      style={{ background: "linear-gradient(160deg,#0e1a2c,#0a1320)" }}
    >
      {/* Header band */}
      <div className="px-5 pt-4 pb-3 relative" style={{ background: "linear-gradient(135deg,var(--bd-green),#024)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center font-bold text-white bg-white/15">N</div>
          <div className="leading-tight">
            <div className="text-white font-bold text-sm">Bangladesh National Party</div>
            <div className="text-white/70 text-[10px] uppercase tracking-widest">Digital Member ID · ডিজিটাল পরিচয়পত্র</div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <span className="flex-1" style={{ background: "var(--bd-green)" }} />
          <span className="flex-1" style={{ background: "var(--bd-red)" }} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-4">
          <Avatar initials={member.initials} hue={member.hue} size={66} />
          <div className="min-w-0">
            <div className="font-bold text-lg leading-tight truncate">{member.name}</div>
            <div className="text-muted text-sm truncate">{member.nameBn}</div>
            <div className="mt-1 inline-flex items-center gap-1 text-xs">
              {member.verified ? (
                <span className="inline-flex items-center gap-1 text-[var(--accent)]">
                  <BadgeCheck size={14} /> Verified member
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[var(--warn)]">
                  <ShieldAlert size={14} /> Pending verification
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-5 text-sm">
          <Field label="Designation" value={member.designation} />
          <Field label="District" value={member.districtName} />
          <Field label="Member ID" value={member.id} mono />
          <Field label="Joined" value={member.joinDate} mono />
        </div>

        {/* QR + footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
          <div className="text-xs text-muted max-w-[170px]">
            Scan to verify authenticity at any party checkpoint or event entry.
          </div>
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG value={verifyUrl} size={72} level="M" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`font-medium truncate ${mono ? "font-mono text-[13px]" : ""}`}>{value}</div>
    </div>
  );
}
