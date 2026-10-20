"use server";

import { redirect } from "next/navigation";
import type { z } from "zod";
import { DbError, getDataLayer } from "@/global/data";
import { ONBOARDING_STEPS } from "./utils/constants";
import { businessSchema } from "./utils/schema";

export type ActionResult =
  | { ok: true }
  | { ok: false; formError?: string; fieldErrors?: Record<string, string> };

/* ---------- helpers (not exported: "use server" files only export async functions) ---------- */

/** Zod issues → { "name": "Required", "expenses.housing": "..." }, first message per field. */
function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    out[key] ??= issue.message;
  }
  return out;
}

/** URL for a step number, from the constants list. */
function pathForStep(step: number): string {
  return ONBOARDING_STEPS.find((s) => s.step === step)!.path;
}

/* ---------- step 1: business ---------- */

export async function saveBusiness(input: unknown): Promise<ActionResult> {
  // 1. validate
  const parsed = businessSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      formError: "Please check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }
  const { name, business_type, timezone } = parsed.data;

  // 2. load
  const dl = await getDataLayer();

  // 3. write
  try {
    const org = await dl.org.get();
    await dl.org.update({
      name,
      business_type,
      timezone,
      // Only move forward: editing step 1 later shouldn't reset progress.
      onboarding_step: Math.max(org.onboarding_step, 2),
    });
  } catch (e) {
    if (e instanceof DbError) {
      console.error("[onboarding:business]", e.message); // full detail, for you
      return { ok: false, formError: e.userMessage };   // friendly, for them
    }
    console.error("[onboarding:business]", e);
    return { ok: false, formError: "Something went wrong. Try again." };
  }

  // 4. advance: outside try/catch, because redirect() throws to navigate
  redirect(pathForStep(2));
}