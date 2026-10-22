import { z } from "zod";
import { clientRowSchema } from "@/global/lib/schemas/client";
import { businessFields } from "@/global/lib/schemas/business";
import { blankToUndefined } from "@/global/lib/schemas/fields";

/*
 * Onboarding schemas. The floor step uses the shared floorSchema
 * (global/lib/schemas/floor.ts), since the Life vest page edits the same data.
 */

/** Step 1: name, type and timezone. */
export const businessSchema = z.object({
  ...businessFields,
  /** Filled in from the browser. */
  timezone: z.preprocess(blankToUndefined, z.string().default("America/New_York")),
});
export type BusinessInput = z.input<typeof businessSchema>;

/** Most clients one save accepts, typed or imported. */
export const MAX_CLIENT_ROWS = 500;

/** True when a row has nothing typed in it (an untouched "add another" row). */
function isBlankRow(row: unknown): boolean {
  if (!row || typeof row !== "object") return false;
  const { name, email, amount } = row as Record<string, unknown>;
  return [name, email, amount].every((v) => v === undefined || v === null || String(v).trim() === "");
}

/**
 * Step 3: the list of clients. Fully blank rows are dropped before
 * validation, so an empty trailing row never blocks saving. Empty list = skip.
 */
export const clientsSchema = z.object({
  clients: z.preprocess(
    (rows) => (Array.isArray(rows) ? rows.filter((r) => !isBlankRow(r)) : rows),
    z.array(clientRowSchema).max(MAX_CLIENT_ROWS, `Up to ${MAX_CLIENT_ROWS} clients at a time`),
  ),
});
