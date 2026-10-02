import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/supabase/server";
import type { MemberRow } from "../types/supabase/types";
import { toDbError } from "./errors";
import { TABLES } from "./tables";

/**
 * The signed-in auth user, or null. cache() memoizes it per request, so the
 * layout, the page and any action can all call it and only the first one
 * hits Supabase.
 *
 * getUser(), not getSession(): getUser() verifies the token with Supabase;
 * getSession() just trusts the cookie.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * The member row for the signed-in user, or null if not signed in (or if
 * signup never created the row). Memoized per request like getAuthUser.
 *
 * maybeSingle(), not single(): a missing row is an expected state here.
 */
export const getCurrentMember = cache(async (): Promise<MemberRow | null> => {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.members)
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw toDbError(error, "get current member");
  return (data as MemberRow) ?? null;
});

export async function isAuthenticated(): Promise<boolean> {
  return (await getAuthUser()) !== null;
}

/** The signed-in user's id. Redirects to login if there isn't one. */
export async function requireAuthUserId(): Promise<string> {
  const user = await getAuthUser();
  if (!user) redirect("/auth/login");
  return user.id;
}