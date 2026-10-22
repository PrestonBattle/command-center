/* ---------- onboarding steps ---------- */

/** Matches orgs.onboarding_step (1–4). Order here is the order users see. */
export const ONBOARDING_STEPS = [
  { step: 1, path: "/onboarding/business", label: "Your business" },
  { step: 2, path: "/onboarding/floor", label: "Your floor" },
  { step: 3, path: "/onboarding/clients", label: "Your clients" },
  { step: 4, path: "/onboarding/done", label: "Done" },
] as const;

/** URL for a step number. Unknown numbers fall back to step 1. */
export function pathForStep(step: number): string {
  return (ONBOARDING_STEPS.find((s) => s.step === step) ?? ONBOARDING_STEPS[0]).path;
}
