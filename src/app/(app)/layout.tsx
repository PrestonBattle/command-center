import { redirect } from "next/navigation";
import { getCurrentOrg } from "@/global/data";
import { MobileNav } from "@/global/components/nav/mobile-nav";
import { Navbar } from "@/global/components/nav/navbar";
import { SkipLink } from "@/global/components/nav/skip-link";

/**
 * The signed-in app. Signed-out users never get here (proxy.ts and
 * getDataLayer both send them to /auth/login). Users who haven't finished
 * onboarding are sent to it, because every page below needs its data.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const org = await getCurrentOrg();
  if (!org.onboarding_completed_at) redirect("/onboarding");

  return (
    <>
      <SkipLink />
      <div className="relative z-10 mx-auto flex max-w-[1500px] gap-4 p-3 sm:p-4">
        <Navbar />
        {/* Bottom padding on phones keeps content clear of the tab bar. */}
        <main id="main" tabIndex={-1} className="flex min-w-0 flex-1 flex-col gap-6 pb-28 outline-none sm:pb-4">
          {children}
        </main>
      </div>
      <MobileNav />
    </>
  );
}
