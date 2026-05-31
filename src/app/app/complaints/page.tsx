import { MapPin, Clock, ExternalLink } from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateComplaintStatus } from "@/lib/complaints/actions";
import { Panel, Badge } from "@/components/ui";
import ComplaintForm from "@/components/app/ComplaintForm";
import { getT } from "@/lib/i18n/server";
import type { Complaint, ComplaintStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const STATUS_META: Record<ComplaintStatus, { key: string; color: string }> = {
  submitted: { key: "cstatus.submitted", color: "var(--muted)" },
  assigned: { key: "cstatus.assigned", color: "var(--accent-2)" },
  in_progress: { key: "cstatus.in_progress", color: "var(--warn)" },
  solved: { key: "cstatus.solved", color: "var(--accent)" },
  rejected: { key: "cstatus.rejected", color: "var(--danger)" },
};
const FLOW: ComplaintStatus[] = ["submitted", "assigned", "in_progress", "solved"];
const NEXT_ACTIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  submitted: ["assigned", "rejected"],
  assigned: ["in_progress", "solved"],
  in_progress: ["solved"],
  solved: [],
  rejected: [],
};

export default async function ComplaintsPage() {
  const { userId, profile } = await getSession();
  const admin = isAdmin(profile);
  const active = profile?.status === "active";
  const t = await getT();

  const supabase = await createClient();
  const { data: complaints } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });
  const list = (complaints ?? []) as Complaint[];

  // Submitter names for admins (members can't read others' profiles via RLS).
  let names = new Map<string, string>();
  if (admin && list.length) {
    const db = createAdminClient();
    const ids = [...new Set(list.map((c) => c.submitted_by).filter(Boolean))] as string[];
    const { data } = await db.from("profiles").select("id, full_name").in("id", ids);
    names = new Map((data ?? []).map((p: { id: string; full_name: string }) => [p.id, p.full_name]));
  }

  const solved = list.filter((c) => c.status === "solved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{t("complaints.title")}</h1>
          <p className="text-muted mt-1">{t("complaints.subtitle")}</p>
        </div>
        {active && <ComplaintForm />}
      </div>

      {list.length > 0 && (
        <div className="flex gap-3 text-sm">
          <Badge color="var(--muted)">{list.length} total</Badge>
          <Badge color="var(--accent)">{solved} {t("cstatus.solved")}</Badge>
        </div>
      )}

      {list.length === 0 ? (
        <Panel><p className="text-sm text-muted py-8 text-center">{t("complaints.empty")}</p></Panel>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map((c) => {
            const meta = STATUS_META[c.status];
            const mine = c.submitted_by === userId;
            const stepIdx = FLOW.indexOf(c.status);
            return (
              <div key={c.id} className="panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{c.title}</h3>
                      {mine && <Badge color="var(--accent-2)">{t("complaints.you")}</Badge>}
                    </div>
                    <div className="text-xs text-muted mt-0.5 capitalize">{c.category}{c.location ? ` · ${c.location}` : ""}</div>
                  </div>
                  <Badge color={meta.color}>{t(meta.key)}</Badge>
                </div>

                {c.description && <p className="text-sm text-muted mt-2 line-clamp-3">{c.description}</p>}

                {/* progress */}
                {c.status !== "rejected" && (
                  <div className="flex items-center gap-1 mt-3">
                    {FLOW.map((s, i) => (
                      <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: i <= stepIdx ? "var(--accent)" : "#22304d" }} />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs text-muted mt-3">
                  <span className="flex items-center gap-1"><Clock size={11} /> {new Date(c.created_at).toLocaleDateString()}</span>
                  {c.lat != null && <span className="flex items-center gap-1"><MapPin size={11} /> {c.lat.toFixed(3)}, {c.lng?.toFixed(3)}</span>}
                  {c.photo_url && <a href={c.photo_url} target="_blank" className="flex items-center gap-1 text-[var(--accent-2)] hover:underline">photo <ExternalLink size={11} /></a>}
                  {admin && c.submitted_by && <span>· by {names.get(c.submitted_by) ?? "member"}</span>}
                </div>

                {admin && NEXT_ACTIONS[c.status].length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {NEXT_ACTIONS[c.status].map((s) => (
                      <form key={s} action={updateComplaintStatus}>
                        <input type="hidden" name="complaint_id" value={c.id} />
                        <input type="hidden" name="status" value={s} />
                        <button className="rounded-lg px-3 py-1.5 text-xs font-medium border border-border hover:bg-white/5"
                          style={s === "solved" ? { background: "var(--accent)", color: "#04130c", borderColor: "var(--accent)" } : s === "rejected" ? { color: "var(--danger)" } : undefined}>
                          {t(STATUS_META[s].key)}
                        </button>
                      </form>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
