import { cookies } from "next/headers";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { PageHeader } from "@/global/components/layout";
import { SignOutButton } from "@/global/components/nav/sign-out-button";
import { SectionBoundary } from "@/global/components/section-boundary";
import { THEME_COOKIE, toThemeId } from "@/global/lib/themes";
import { BusinessSettingsSection } from "./_components/business-settings-section";
import { ProfileSection } from "./_components/profile-section";
import { SettingsFormSkeleton } from "./_components/settings-form-skeleton";
import { ThemePicker } from "./_components/theme-picker";
import { getSettingsView } from "./_server/queries";

/**
 * Settings: your business, your profile, the color theme, and Sign out --
 * which phones had no other way to reach, since the bottom tab bar has no
 * room for it.
 */
export default async function SettingsPage() {
  const viewPromise = getSettingsView();
  // The theme comes from a cookie, not the database, so it's ready at once.
  const theme = toThemeId((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <>
      <PageHeader title="Settings" description="Your business, your profile, and how Command Center looks." />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <SectionBoundary skeleton={<SettingsFormSkeleton title="Business" label="your business" fields={3} />} errorMessage="Couldn't load your business details.">
          <BusinessSettingsSection viewPromise={viewPromise} />
        </SectionBoundary>
        <SectionBoundary skeleton={<SettingsFormSkeleton title="Your profile" label="your profile" fields={3} />} errorMessage="Couldn't load your profile.">
          <ProfileSection viewPromise={viewPromise} />
        </SectionBoundary>
      </div>
      <GlassPanel title="Appearance">
        <ThemePicker initial={theme} />
      </GlassPanel>
      <GlassPanel title="Account">
        <div className="max-w-xs">
          <SignOutButton />
        </div>
      </GlassPanel>
    </>
  );
}
