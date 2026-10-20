import { GlassPanel } from "@/global/components/glass/glass-panel";
import { PageHeader } from "@/global/components/layout";
import { requireStep } from "../_lib/steps";
import { BusinessForm } from "./_components/business-form";

/** Onboarding step 1: what the business is called and what it does. */
export default async function BusinessStepPage() {
  const org = await requireStep(1);

  return (
    <GlassPanel padding="lg" className="mx-auto max-w-2xl">
      <PageHeader title="Tell us about your business" description="Two quick things so your dashboard speaks your language." />
      <BusinessForm defaultName={org.name} defaultType={org.business_type} />
    </GlassPanel>
  );
}
