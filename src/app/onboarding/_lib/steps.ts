import "server-only";

import { redirect } from "next/navigation";
import { getCurrentOrg } from "@/global/data";
import { ONBOARDING_STEPS, pathForStep } from "./constants";

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]["step"];
export { pathForStep };

/**
 * Call at the top of each step page. Sends the user back to their current
 * step if they type a URL to skip ahead. Going back to a finished step is
 * allowed, so they can edit it.
 */
export async function requireStep(step: OnboardingStep) {
  const org = await getCurrentOrg();
  if (step > org.onboarding_step) redirect(pathForStep(org.onboarding_step));
  return org;
}
