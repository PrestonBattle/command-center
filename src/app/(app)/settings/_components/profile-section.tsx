"use client";

import { use } from "react";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import type { SettingsView } from "../_server/queries";
import { ProfileForm } from "./profile-form";

/** The Your profile panel once loaded. A client section: it's a form. */
export function ProfileSection({ viewPromise }: { viewPromise: Promise<SettingsView> }) {
  const { profile, email } = use(viewPromise);
  return (
    <GlassPanel title="Your profile" description="Just for you; clients never see this.">
      <ProfileForm initialValues={profile} email={email} />
    </GlassPanel>
  );
}
