import "server-only";

import { toLogEntry, type LogContext } from "./log-entry";

/*
 * Server logging. Each call writes ONE line of JSON to stderr/stdout, which
 * every host (Vercel, Fly, Render, a VPS with journald) collects and can
 * search. JSON rather than free text so "label" and "digest" can be
 * filtered on.
 *
 * This is the one place errors leave the app. To add Sentry (or similar)
 * later, send the entry there inside `write`; no caller changes.
 */

function write(entry: ReturnType<typeof toLogEntry>) {
  const line = JSON.stringify(entry);
  if (entry.level === "error") console.error(line);
  else if (entry.level === "warn") console.warn(line);
  else console.info(line);
}

/** Something broke for someone. `label` says where ("clients:update"). */
export function logError(label: string, error: unknown, context?: LogContext) {
  write(toLogEntry("error", label, error, context));
}

/** Something odd that didn't break anything yet. */
export function logWarn(label: string, message: string, context?: LogContext) {
  write(toLogEntry("warn", label, message, context));
}
