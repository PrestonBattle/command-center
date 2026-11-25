import { reportClientError } from "./report-client-error";

/**
 * Browser side: sends a caught error to the server logs. Fire and forget:
 * logging must never break the error screen it's called from, so a failed
 * send (offline, signed out) is swallowed.
 */
export function sendClientError(where: string, error: Error & { digest?: string }) {
  reportClientError({
    where,
    message: error.message,
    stack: error.stack,
    digest: error.digest,
    path: typeof window === "undefined" ? undefined : window.location.pathname,
  }).catch(() => {});
}
