import { redirect } from "next/navigation";
import { UserCheck, Clock, Ban } from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { approveMember, setMemberStatus } from "@/lib/admin/actions";
import { Panel, Badge, Avatar } from "@/components/ui";
import { getT } from "@/lib/i18n/server";
import type { Profile, OrgNode } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { profile } = await getSession();
  if (!isAdmin(profile)) redirect("/app");
  const t = await getT();

  const db = createAdminClient();
  const [{ data: pending }, { data: active }, { data: districts }] = await Promise.all([
    db.from("profiles").select("*").eq("status", "pending").order("joined_at", { ascending: true }),
    db.from("profiles").select("*").eq("status", "active").order("activity_score", { ascending: false }).limit(50),
    db.from("org_nodes").select("*").eq("level", "district").order("name"),
  ]);

  const pendingList = (pending ?? []) as Profile[];
  const activeList = (active ?? []) as Profile[];
  const districtList = (districts ?? []) as OrgNode[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("admin.title")}</h1>
        <p className="text-muted mt-1">{t("admin.subtitle")}</p>
      </div>

      <Panel
        title={`${t("verify.pending")} (${pendingList.length})`}
        subtitle={t("verify.pendingSub")}
      >
        {pendingList.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">{t("verify.noPending")}</p>
        ) : (
          <ul className="space-y-3">
            {pendingList.map((m) => (
              <li key={m.id} className="rounded-xl border border-border bg-[#0d1626] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar initials={initials(m.full_name)} hue={120} size={40} />
                  <div className="min-w-0">
                    <div className="font-medium">{m.full_name || "(no name)"}</div>
                    <div className="text-xs text-muted">{m.phone || "no phone"} · joined {m.joined_at.slice(0, 10)}</div>
                  </div>
                  <Badge color="var(--warn)"><Clock size={11} /> {t("verify.pendingBadge")}</Badge>
                </div>
                <form action={approveMember} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="member_id" value={m.id} />
                  <label className="text-xs text-muted">
                    {t("form.committee")}
                    <select name="org_node_id" required className="mt-1 block w-48 px-2 py-2 rounded-lg bg-[#0a1320] border border-border text-sm text-foreground">
                      <option value="">{t("verify.selectDistrict")}</option>
                      {districtList.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs text-muted">
                    {t("verify.designation")}
                    <input name="designation" defaultValue="Ward Organiser" className="mt-1 block w-44 px-2 py-2 rounded-lg bg-[#0a1320] border border-border text-sm" />
                  </label>
                  <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
                    <UserCheck size={15} /> {t("verify.approve")}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title={`${t("verify.active")} (${activeList.length})`} subtitle={t("verify.activeSub")}>
        {activeList.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">{t("verify.noActive")}</p>
        ) : (
          <ul className="divide-y divide-border">
            {activeList.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-2.5">
                <Avatar initials={initials(m.full_name)} hue={200} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{m.full_name}</div>
                  <div className="text-xs text-muted truncate">{m.designation}</div>
                </div>
                <span className="text-sm font-semibold text-[var(--accent)] tabular-nums w-8 text-right">{m.activity_score}</span>
                <form action={setMemberStatus}>
                  <input type="hidden" name="member_id" value={m.id} />
                  <input type="hidden" name="status" value="suspended" />
                  <button className="text-muted hover:text-[var(--danger)] p-1.5" title="Suspend">
                    <Ban size={15} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "M";
}
