import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin client (service role key).
 *
 * `import "server-only"` — NOT `"use server"`. The latter marks every
 * export as a server ACTION, which Next publishes as a POST endpoint the
 * browser can invoke by ID. That's the opposite of what a service-role
 * factory wants. `server-only` is a build-time error if it's ever imported
 * from client code, which is the actual guarantee you're after.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}