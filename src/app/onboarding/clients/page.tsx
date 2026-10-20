import { GlassPanel } from "@/global/components/glass/glass-panel";
import { PageHeader } from "@/global/components/layout";
import { getDataLayer } from "@/global/data";
import { floorFromSaved } from "@/global/lib/floor-form";
import { requireStep } from "../_lib/steps";
import { ClientsStepForm } from "./_components/clients-step-form";

/** Onboarding step 3: who pays you, typed in or imported from a CSV. */
export default async function ClientsStepPage() {
  const org = await requireStep(3);
  const expenses = await (await getDataLayer()).expenses.list();

  return (
    <GlassPanel padding="lg">
      <PageHeader
        title="Who pays you?"
        description="Add your regular clients and what they pay. This is what we measure against your floor."
      />
      <ClientsStepForm floorCents={floorFromSaved(expenses, org.tax_reserve_rate)} />
    </GlassPanel>
  );
}
