import type { z } from "zod";

/*
 * The shape every server action returns, and the helpers that build a
 * validation failure. Safe to import from client code (forms read
 * ActionResult). The server-only write wrapper lives in ./attempt.ts.
 */

/** What a server action hands back to its form. */
export type ActionResult =
  | { ok: true }
  | {
      ok: false;
      /** Shown above the submit button, in a role="alert" region. */
      formError?: string;
      /** Keyed by field path: "name", "expenses.housing", "clients.3.amount". */
      fieldErrors?: Record<string, string>;
    };

/**
 * Zod issues → `{ "clients.3.amount": "Must be more than $0" }`.
 * Paths are joined with "." to match Mantine form field paths, so errors
 * land on the right input. One field can have several issues; the first wins.
 */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    out[key] ??= issue.message;
  }
  return out;
}

/** The failed-validation result, ready to return from an action. */
export function invalid(error: z.ZodError): ActionResult {
  return {
    ok: false,
    formError: "Please check the highlighted fields.",
    fieldErrors: toFieldErrors(error),
  };
}
