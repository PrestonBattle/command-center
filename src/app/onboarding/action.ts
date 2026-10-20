"use server";

import { redirect } from "next/navigation";
import { getDataLayer } from "@/global/data";
import { invalid, type ActionResult } from "@/global/lib/action-result";
import { attempt } from "@/global/lib/attempt";
import { ONBOARDING_STEPS } from "./utils/constants";
import { businessSchema } from "./utils/schema";

/*
 * Onboarding server actions. Each one: validate → load the data layer →
 * write inside attempt() → redirect to the next step (outside attempt,
 * because redirect works by throwing).
 */

/** URL for a step number. Steps are fixed in ONBOARDING_STEPS, so a miss is a bug. */
function pathForStep(step: number): string {
  const match = ONBOARDING_STEPS.find((s) => s.step === step);
  if (!match) throw new Error(`No onboarding step ${step}`);
  return match.path;
}

/** Step 1: save the business name, type and timezone. */
export async function saveBusiness(input: unknown): Promise<ActionResult> {
  const parsed = businessSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { name, business_type, timezone } = parsed.data;

  const dl = await getDataLayer();
  const failed = await attempt("onboarding:business", async () => {
    const org = await dl.org.get();
    await dl.org.update({
      name,
      business_type,
      timezone,
      // Only move forward: editing step 1 later shouldn't reset progress.
      onboarding_step: Math.max(org.onboarding_step, 2),
    });
  });
  if (failed) return failed;

  redirect(pathForStep(2));
}
