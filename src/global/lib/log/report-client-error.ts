"use server";

import { z } from "zod";
import { logError } from "./log";
import { clip, MAX_MESSAGE, MAX_STACK } from "./log-entry";

/*
 * The browser's way to get an error into the server logs: a crashed page
 * or section only shows in that person's own console otherwise.
 *
 * Anyone can call a server action, so this trusts nothing: every field is
 * capped, and it never throws or returns details. Rate limiting arrives
 * with R10; until then the caps keep one call to a few KB.
 */

const reportSchema = z.object({
  /** "client:section", "client:page", "client:root". */
  where: z.string().max(40),
  message: z.string().transform((v) => clip(v, MAX_MESSAGE)),
  stack: z.string().transform((v) => clip(v, MAX_STACK)).optional(),
  digest: z.string().max(64).optional(),
  path: z.string().transform((v) => clip(v, 300)).optional(),
});

/** Logs an error the browser caught. Silently ignores anything malformed. */
export async function reportClientError(input: unknown): Promise<void> {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) return;
  const { where, message, stack, digest, path } = parsed.data;
  const error = Object.assign(new Error(message), { name: "ClientError", stack });
  logError(where, error, { digest, path, source: "browser" });
}
