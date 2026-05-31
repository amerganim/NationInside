import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile, OrgNode } from "@/lib/supabase/types";

export interface SessionData {
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  orgNode: OrgNode | null;
}

/**
 * Current signed-in user + their profile (and org node).
 *
 * Wrapped in React `cache()` so the layout, the page, and any server action in
 * the same request share ONE execution — instead of each repeating getUser()
 * plus profile/org queries. Profile and org are fetched in a single embedded
 * query to avoid an extra round-trip.
 */
export const getSession = cache(async (): Promise<SessionData> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { userId: null, email: null, profile: null, orgNode: null };

  const { data } = await supabase
    .from("profiles")
    .select("*, org_nodes(*)")
    .eq("id", user.id)
    .single();

  const row = data as (Profile & { org_nodes: OrgNode | null }) | null;
  const orgNode = row?.org_nodes ?? null;

  return { userId: user.id, email: user.email ?? null, profile: row as Profile | null, orgNode };
});

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
