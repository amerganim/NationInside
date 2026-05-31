import { Target, Award, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { acceptTask, reviewTask } from "@/lib/tasks/actions";
import { Panel, Badge } from "@/components/ui";
import TaskCreateForm from "@/components/app/TaskCreateForm";
import TaskSubmitForm from "@/components/app/TaskSubmitForm";
import type { TaskRow, TaskAssignment, OrgNode } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  assigned: { label: "Accepted", color: "var(--accent-2)" },
  in_progress: { label: "In progress", color: "var(--accent-2)" },
  submitted: { label: "Awaiting review", color: "var(--warn)" },
  approved: { label: "Approved", color: "var(--accent)" },
  rejected: { label: "Rejected", color: "var(--danger)" },
};

export default async function TasksPage() {
  const { profile } = await getSession();
  const admin = isAdmin(profile);
  const active = profile?.status === "active";

  const supabase = await createClient();
  const [{ data: tasks }, { data: myAssignments }] = await Promise.all([
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
    supabase.from("task_assignments").select("*"),
  ]);
  const taskList = (tasks ?? []) as TaskRow[];
  const mine = new Map<string, TaskAssignment>();
  for (const a of (myAssignments ?? []) as TaskAssignment[]) mine.set(a.task_id, a);

  const db = createAdminClient();
  let districts: OrgNode[] = [];
  let reviewQueue: ReviewRow[] = [];
  if (admin) {
    const [{ data: d }, { data: q }] = await Promise.all([
      db.from("org_nodes").select("*").eq("level", "district").order("name"),
      db.from("task_assignments")
        .select("id, note, photo_url, submitted_at, lat, lng, profiles(full_name), tasks(title, points)")
        .eq("status", "submitted")
        .order("submitted_at", { ascending: true }),
    ]);
    districts = (d ?? []) as OrgNode[];
    reviewQueue = (q ?? []) as unknown as ReviewRow[];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Tasks &amp; Missions</h1>
          <p className="text-muted mt-1">Accept missions, complete them with geo-tagged proof, and earn points.</p>
        </div>
        {admin && <TaskCreateForm districts={districts} />}
      </div>

      {admin && reviewQueue.length > 0 && (
        <Panel title={`Submissions to review (${reviewQueue.length})`} subtitle="Approve to award points">
          <ul className="space-y-3">
            {reviewQueue.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-[#0d1626] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{r.tasks?.title} <span className="text-muted">· {r.profiles?.full_name}</span></div>
                    {r.note && <p className="text-sm text-muted mt-1">“{r.note}”</p>}
                    <div className="flex items-center gap-3 text-xs text-muted mt-1">
                      {r.submitted_at && <span className="flex items-center gap-1"><Clock size={11} /> {new Date(r.submitted_at).toLocaleString()}</span>}
                      {r.lat != null && <span className="flex items-center gap-1"><MapPin size={11} /> {r.lat.toFixed(3)}, {r.lng?.toFixed(3)}</span>}
                    </div>
                    {r.photo_url && <a href={r.photo_url} target="_blank" className="text-xs text-[var(--accent-2)] hover:underline">View photo ↗</a>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <form action={reviewTask}>
                      <input type="hidden" name="assignment_id" value={r.id} />
                      <input type="hidden" name="decision" value="approve" />
                      <button className="rounded-lg px-3 py-1.5 text-sm text-white inline-flex items-center gap-1" style={{ background: "var(--accent)", color: "#04130c" }}>
                        <CheckCircle2 size={14} /> +{r.tasks?.points}
                      </button>
                    </form>
                    <form action={reviewTask}>
                      <input type="hidden" name="assignment_id" value={r.id} />
                      <input type="hidden" name="decision" value="reject" />
                      <button className="rounded-lg px-2.5 py-1.5 text-sm text-muted border border-border hover:text-[var(--danger)]"><XCircle size={14} /></button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {taskList.length === 0 ? (
        <Panel><p className="text-sm text-muted py-8 text-center">No tasks yet.{admin ? " Create the first mission above." : ""}</p></Panel>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {taskList.map((t) => {
            const a = mine.get(t.id);
            const badge = a ? STATUS_BADGE[a.status] : null;
            return (
              <div key={t.id} className="panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-[var(--accent)]" />
                      <h3 className="font-semibold">{t.title}</h3>
                    </div>
                    <Badge color="var(--muted)">{t.category}</Badge>
                  </div>
                  <span className="text-sm font-semibold text-[var(--warn)] flex items-center gap-1 shrink-0"><Award size={14} /> {t.points}</span>
                </div>
                {t.description && <p className="text-sm text-muted mt-2">{t.description}</p>}

                <div className="mt-4">
                  {!active ? (
                    <p className="text-xs text-[var(--warn)]">Verify your membership to take tasks.</p>
                  ) : !a ? (
                    <form action={acceptTask}>
                      <input type="hidden" name="task_id" value={t.id} />
                      <button className="rounded-lg px-4 py-2 text-sm font-medium border border-border hover:bg-white/5">Accept mission</button>
                    </form>
                  ) : a.status === "assigned" || a.status === "in_progress" ? (
                    <TaskSubmitForm assignmentId={a.id} />
                  ) : (
                    badge && <Badge color={badge.color}>{badge.label}{a.status === "approved" ? ` · +${a.points_awarded}` : ""}</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ReviewRow {
  id: string;
  note: string | null;
  photo_url: string | null;
  submitted_at: string | null;
  lat: number | null;
  lng: number | null;
  profiles: { full_name: string } | null;
  tasks: { title: string; points: number } | null;
}
