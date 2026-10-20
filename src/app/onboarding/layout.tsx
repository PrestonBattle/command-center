import { IconBrain } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { getCurrentOrg } from "@/global/data";
import { SkipLink } from "@/global/components/nav/skip-link";
import { OnboardingProgress } from "./_components/onboarding-progress";

/**
 * Wraps every onboarding step. Signed-out users are sent to login by
 * getDataLayer; finished users go to the dashboard. Layouts can't see the
 * URL, so "don't skip ahead" is checked per page with requireStep().
 */
export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const org = await getCurrentOrg();
  if (org.onboarding_completed_at) redirect("/");

  return (
    <>
      <SkipLink />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 sm:px-8 sm:py-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2.5 font-display text-lg font-bold">
            <IconBrain size={24} stroke={1.6} aria-hidden className="text-[var(--accent)]" />
            Command Center
          </p>
          <div className="sm:w-[480px]">
            <OnboardingProgress furthestStep={org.onboarding_step} />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </div>
    </>
  );
}
