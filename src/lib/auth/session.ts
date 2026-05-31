import { createClient } from "@/lib/supabase/server";
import type { Profile, OrgNode } from "@/lib/supabase/types";

export interface SessionData {
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  orgNode: OrgNode | null;
}

/** Current signed-in user + their profile (and org node), via RLS-scoped client. */
export async function getSession(): Promise<SessionData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { userId: null, email: null, profile: null, orgNode: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  let orgNode: OrgNode | null = null;
  if (profile?.org_node_id) {
    const { data } = await supabase
      .from("org_nodes")
      .select("*")
      .eq("id", profile.org_node_id)
      .single<OrgNode>();
    orgNode = data;
  }

  return { userId: user.id, email: user.email ?? null, profile, orgNode };
}

export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === "admin" || profile?.role === "super_admin";
}

/** Throws unless a user is signed in. Returns the session. */
export async function requireUser(): Promise<SessionData> {
  const session = await getSession();
  if (!session.userId) throw new Error("Not signed in");
  return session;
}

/** Throws unless the signed-in user is an admin. Returns the session. */
export async function requireAdmin(): Promise<SessionData> {
  const session = await getSession();
  if (!isAdmin(session.profile)) throw new Error("Not authorised");
  return session;
}
