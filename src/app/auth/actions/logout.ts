"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/supabase/server";

export async function logout() {
  const supabase = await createClient();

  // Clears the session cookies and revokes the refresh token server-side,
  // so it can't be replayed even if someone captured it.
  await supabase.auth.signOut();

  // Without this, the cached server-component tree still holds pages
  // rendered while signed in — the user lands on /auth/login but hitting
  // back shows their dashboard from cache.
  revalidatePath("/", "layout");

  redirect("/auth/login");
}