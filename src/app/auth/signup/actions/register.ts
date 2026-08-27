"use server";

import { createClient } from "@/app/supabase/server";
import { createAdminClient } from "@/app/supabase/admin";
import { registrationSchema } from "../validation";

interface RegisterResult {
  success: boolean;
  error?: string;
}

/**
 * `values` is `unknown`, not MemberOrgRegistration — it arrives from the
 * browser, so any type annotation upstream is unenforceable. safeParse is
 * what actually establishes the type.
 *
 * No redirect() in here. redirect() throws NEXT_REDIRECT, the catch below
 * would swallow it as a failure, and the rollback would delete a user who
 * just succeeded. The caller navigates on { success: true }.
 *
 * Assumes email confirmation is OFF, so signUp returns a session and the
 * RPC can run immediately. If you turn confirmation on later, signUp
 * returns no session, the RPC can't run, and you'll need a recovery path.
 */
export async function RegisterUserOrg(values: unknown): Promise<RegisterResult> {
  const genericError = "Oops! Something went wrong, try again.";

  const parsed = registrationSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Please check your information and try again." };
  }

  const data = parsed.data;
  let userId: string | null = null;

  try {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError || !authData.user) {
      console.error("[register_member_org] signUp failed:", authError?.message);
      return { success: false, error: "Could not create account. Please try again." };
    }

    // Supabase does NOT error on a duplicate email — it returns a decoy user
    // so attackers can't enumerate accounts. Empty identities is the tell.
    // Without this check you'd create an Org bound to a stranger's account.
    if (authData.user.identities?.length === 0) {
      return { success: false, error: "An account with this email already exists." };
    }

    userId = authData.user.id;

    const admin = createAdminClient();

    const { data: result, error: rpcError } = await admin.rpc("register_member_org", {
      payload: {
        user_id: userId,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        org_name: data.orgName,
      },
    });

    // Both halves are required. rpcError catches what the function never
    // reached — network, wrong name, wrong arg names, permission denied.
    // !result.success catches what it handled and returned 200 for, since
    // the function returns its errors rather than raising them.
    if (rpcError || !result?.success) {
      console.error("[register_member_org] RPC failed:", {
        rpcError: rpcError?.message,
        code: result?.code,
        error: result?.error,
        sqlstate: result?.sqlstate,
      });

      // Both inserts rolled back inside the function. Delete the auth user
      // so the email isn't stranded — otherwise they can't log in (no org)
      // and can't sign up again (email taken).
      await admin.auth.admin.deleteUser(userId);
      return { success: false, error: genericError };
    }

    return { success: true };
  } catch (error) {
    console.error("[register_member_org] Unexpected error:", error);

    if (userId) {
      try {
        const admin = createAdminClient();
        await admin.auth.admin.deleteUser(userId);
      } catch (rollbackError) {
        console.error("[register_member_org] Rollback failed:", rollbackError);
      }
    }

    return { success: false, error: genericError };
  }
}