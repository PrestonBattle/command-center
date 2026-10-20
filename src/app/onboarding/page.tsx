import { redirect } from "next/navigation";
import { getCurrentOrg } from "@/global/data";
import { pathForStep } from "./_lib/steps";

/** /onboarding → wherever the user left off. */
export default async function OnboardingPage() {
  const org = await getCurrentOrg();
  redirect(pathForStep(org.onboarding_step));
}
