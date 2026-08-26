"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/supabase/server";
import { loginSchema } from "../validation";


interface LoginResult {
  success: boolean;
  error?: string;
}

/**
 * `values` is `unknown` -- it comes from the browser, so safeParse is what
 * establishes the type, not the annotation.
 *
 * No redirect() here. The caller navigates on success, which keeps this
 * consistent with RegisterUserOrg and avoids NEXT_REDIRECT being caught
 * by any future try/catch.
 *
 * Rate limiting goes right below the parse when you port the limiter over
 * -- gate on IP and on email. Login is the endpoint that gets hammered.
 */
export async function LoginUser(values: unknown): Promise<LoginResult> {
  // One message for every failure mode below. Distinguishing "no such
  // account" from "wrong password" tells an attacker which emails are
  // registered -- that's account enumeration, and it's the whole reason
  // this string is reused rather than made specific.
  const genericError = "That email and password don't match an account.";

  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Enter your email and password." };
  }

  const { email, password } = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("[login] signIn failed:", error.message);
      return { success: false, error: genericError };
    }

    // signInWithPassword sets the session cookies. Without this, server
    // components rendered from the client's cached tree still think the
    // user is signed out, and the redirect bounces straight back here.
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("[login] Unexpected error:", error);
    return { success: false, error: "Something went wrong. Try again." };
  }
}