import { cookies } from "next/headers";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { PageHeader } from "@/global/components/layout";
import { SignOutButton } from "@/global/components/nav/sign-out-button";
import { THEME_COOKIE, toThemeId } from "@/global/lib/themes";
import { ThemePicker } from "./_components/theme-picker";

/**
 * Settings. For now: the color theme, and Sign out -- which phones had no
 * other way to reach, since the bottom tab bar has no room for it.
 */
export default async function SettingsPage() {
  const theme = toThemeId((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <>
      <PageHeader title="Settings" description="How Command Center looks on this device." />
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
