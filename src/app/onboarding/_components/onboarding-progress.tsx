"use client";

import { usePathname, useRouter } from "next/navigation";
import { Stepper } from "@/global/components/stepper/stepper";
import { ONBOARDING_STEPS } from "../_lib/constants";

/**
 * Connects the shared Stepper to onboarding: the URL says which step is
 * showing, the org's onboarding_step (1-based) says how far they've got.
 */
export function OnboardingProgress({ furthestStep }: { furthestStep: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = ONBOARDING_STEPS.findIndex((s) => pathname.startsWith(s.path));

  return (
    <Stepper
      labels={ONBOARDING_STEPS.map((s) => s.label)}
      current={Math.max(current, 0)}
      highest={furthestStep - 1}
      onStepClick={(i) => router.push(ONBOARDING_STEPS[i].path)}
    />
  );
}
