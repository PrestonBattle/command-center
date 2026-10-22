import { unstable_rethrow } from "next/navigation";
import type { ActionResult } from "./action-result";

/** Shown when the browser is offline and an action couldn't be sent. */
export const OFFLINE_MESSAGE = "You're offline, so nothing was saved. Check your connection and try again.";

/**
 * Shown when an action threw instead of returning a result. In practice that
 * means the session ended (the request was bounced to the login page, which
 * the client can't read as an action response) or the server fell over.
 * Reloading handles both: it signs you in again or shows the error page.
 */
export const UNREACHABLE_MESSAGE = "That didn't save. You may have been signed out. Reload the page and try again.";

// Only a browser that says it's offline counts as offline. Node has a
// `navigator` without `onLine`, and older browsers may lack it too.
function isOnline(): boolean {
  return typeof navigator === "undefined" || navigator.onLine !== false;
}

/** The message for an action that threw, depending on whether we're online. */
export function thrownActionMessage(online: boolean = isOnline()): string {
  return online ? UNREACHABLE_MESSAGE : OFFLINE_MESSAGE;
}

/**
 * Calls a server action from the browser and turns a thrown error into an
 * ordinary failed result, so a form shows a message instead of crashing the
 * page. Next's own control flow (redirect, notFound) is rethrown untouched.
 * Returns undefined when the action redirected, like a bare action call.
 */
export async function safeAction(call: () => Promise<ActionResult | undefined>): Promise<ActionResult | undefined> {
  try {
    return await call();
  } catch (error) {
    unstable_rethrow(error);
    return { ok: false, formError: thrownActionMessage() };
  }
}
