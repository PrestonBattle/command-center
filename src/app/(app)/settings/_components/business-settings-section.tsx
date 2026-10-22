"use client";

import { use } from "react";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import type { SettingsView } from "../_server/queries";
import { BusinessSettingsForm } from "./business-settings-form";

/** The Business panel once loaded. A client section: it's a form. */
export function BusinessSettingsSection({ viewPromise }: { viewPromise: Promise<SettingsView> }) {
  const { business, timezones } = use(viewPromise);
  return (
    <GlassPanel title="Business" description="Shown across the app and used for dates.">
      <BusinessSettingsForm initialValues={business} timezones={timezones} />
    </GlassPanel>
  );
}
