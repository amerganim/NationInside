import { getSession, isAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Panel } from "@/components/ui";
import MobilizeCreateForm from "@/components/app/MobilizeCreateForm";
import MobilizeLive from "@/components/app/MobilizeLive";
import type { Mobilization, OrgNode } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function MobilizePage() {
  const { userId, profile } = await getSession();
  const admin = isAdmin(profile);
  const active = profile?.status === "active";

  const supabase = await createClient();
  const [{ data: mobs }, { data: responses }] = await Promise.all([
    supabase.from("mobilizations").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("mobilization_responses").select("mobilization_id, member_id, response"),
  ]);
  const mobList = (mobs ?? []) as Mobilization[];
  const allResponses = (responses ?? []) as { mobilization_id: string; member_id: string; response: "coming" | "enroute" | "declined" }[];

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
          <h1 className="text-2xl font-bold">Mobilisation</h1>
          <p className="text-muted mt-1">Respond to call-ups in one tap — responses update live for everyone.</p>
        </div>
        {admin && <MobilizeCreateForm districts={districts} />}
      </div>

      {mobList.length === 0 ? (
        <Panel><p className="text-sm text-muted py-8 text-center">No active call-ups.{admin ? " Issue one above." : ""}</p></Panel>
      ) : (
        <div className="grid gap-4">
          {mobList.map((m) => (
            <MobilizeLive
              key={m.id}
              mobilizationId={m.id}
              title={m.title}
              createdAt={m.created_at}
              myUserId={userId ?? ""}
              active={active}
              initial={allResponses
                .filter((r) => r.mobilization_id === m.id)
                .map((r) => ({ member_id: r.member_id, response: r.response }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
