import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/supabase/server";
import { APPCONFIG } from "../config/config";
import { MembersRow } from "../types/supabase/types";

/**
 * The single network call. cache() memoizes it per request, so the layout,
 * the page, and any action can all call it and only the first one hits
 * Supabase — React hands the rest the same promise.
 *
 * Everything below derives from this. Adding another auth helper means
 * building on this one, not making a fourth getUser() call.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * The member row for the signed-in user, or null.
 *
 * Null means one of two things, and callers distinguish them by checking
 * getAuthUser() separately — or just use getDataLayer(), which handles both:
 *   - not signed in
 *   - signed in but signup never finished (no Members row)
 *
 * maybeSingle(), not single(): a missing row is an expected state here.
 */
export const getCurrentMember = cache(async (): Promise<MembersRow | null> => {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(APPCONFIG.table.members)
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch current member: ${error.message}`);
  return (data as MembersRow) ?? null;
});

export async function isAuthenticated(): Promise<boolean> {
  return (await getAuthUser()) !== null;
}

export async function requireAuthUserId(): Promise<string> {
  const user = await getAuthUser();
  if (!user) redirect("/auth/login");
  return user.id;
}

/** The org for the current request. Redirects rather than returning null. */
export async function requireOrgId(): Promise<string> {
  const member = await getCurrentMember();
  if (!member) redirect("/auth/login");
  if (!member.org_id) redirect("/onboarding");
  return member.org_id;
}