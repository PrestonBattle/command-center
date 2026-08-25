import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase server client with two authentication modes:
 *
 * **Cookie mode (default)** — omit `accessToken`.
 * Reads the session from the request cookies via `next/headers`.
 * Use this for all standard server actions, data layer functions,
 * and server components that are NOT inside a `"use cache"` boundary.
 *
 * @example
 * const supabase = await createClient();
 * const { data: { user } } = await supabase.auth.getUser();
 *
 * **Token mode** — pass a Supabase `access_token` string.
 * Builds the client from the token via an Authorization header instead
 * of reading cookies. Use this inside `"use cache"` functions where
 * `cookies()` is forbidden. The token must be obtained outside the
 * cache boundary and passed in as a serializable argument.
 *
 * @example
 * // Outside the cache boundary:
 * const supabase = await createClient();
 * const { data: { session } } = await supabase.auth.getSession();
 *
 * // Inside "use cache":
 * const supabase = await createClient(session.access_token);
 *
 * @param accessToken - Optional Supabase JWT access token. When provided,
 * skips cookie access entirely and authenticates via Authorization header.
 */
export async function createClient(accessToken?: string) {
  if (accessToken) {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      }
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
