import "server-only";

import { DbError } from "@/global/data/errors";
import type { ActionResult } from "./action-result";

/** Message for any failure that isn't a known database error. */
const GENERIC_ERROR = "Something went wrong. Try again.";

/**
 * Runs a server action's write step. Returns null on success, or a failure
 * ActionResult to return as-is.
 *
 * Call `redirect()` AFTER this, never inside `work`: redirect works by
 * throwing, and this catch would swallow it.
 *
 * @param label Shows up in server logs, e.g. "onboarding:business".
 */
export async function attempt(
  label: string,
  work: () => Promise<void>,
): Promise<ActionResult | null> {
  try {
    await work();
    return null;
  } catch (e) {
    if (e instanceof DbError) {
      // Full detail for the logs; the friendly message for the person.
      console.error(`[${label}]`, e.message);
      return { ok: false, formError: e.userMessage };
    }
    console.error(`[${label}]`, e);
    return { ok: false, formError: GENERIC_ERROR };
  }
}
