import { Megaphone, Pin, Trash2 } from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteNotice } from "@/lib/notices/actions";
import { Panel, Badge } from "@/components/ui";
import NoticeCreateForm from "@/components/app/NoticeCreateForm";
import type { Notice, OrgNode } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const { profile } = await getSession();
  const admin = isAdmin(profile);

  const supabase = await createClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("*")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  const list = (notices ?? []) as Notice[];

  let districts: OrgNode[] = [];
  if (admin) {
    const db = createAdminClient();
    const { data } = await db.from("org_nodes").select("*").eq("level", "district").order("name");
    districts = (data ?? []) as OrgNode[];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Notices</h1>
          <p className="text-muted mt-1">Official announcements from party leadership.</p>
        </div>
        {admin && <NoticeCreateForm districts={districts} />}
      </div>

      {list.length === 0 ? (
        <Panel><p className="text-sm text-muted py-8 text-center">No notices yet.{admin ? " Post the first announcement above." : ""}</p></Panel>
      ) : (
        <div className="space-y-3">
          {list.map((n) => (
            <div key={n.id} className="panel p-5">
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg grid place-items-center bg-white/5 text-[var(--accent)] shrink-0"><Megaphone size={17} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{n.title}</h3>
                    {n.pinned && <Badge color="var(--warn)"><Pin size={11} /> Pinned</Badge>}
                  </div>
                  {n.body && <p className="text-sm text-muted mt-1 whitespace-pre-wrap">{n.body}</p>}
                  <div className="text-xs text-muted mt-2">{new Date(n.created_at).toLocaleString()}</div>
                </div>
                {admin && (
                  <form action={deleteNotice}>
                    <input type="hidden" name="notice_id" value={n.id} />
                    <button className="text-muted hover:text-[var(--danger)] p-1.5" title="Delete"><Trash2 size={15} /></button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
