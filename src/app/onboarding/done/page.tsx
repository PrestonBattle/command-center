import { GlassPanel } from "@/global/components/glass/glass-panel";
import { PageHeader, Stat } from "@/global/components/layout";
import { getDataLayer } from "@/global/data";
import { monthlyRevenueCents } from "@/global/lib/billing";
import { todayIso } from "@/global/lib/dates";
import { floorFromSaved } from "@/global/lib/floor-form";
import { formatCents } from "@/global/lib/money";
import { requireStep } from "../_lib/steps";
import { FinishButton } from "./_components/finish-button";

/** Onboarding step 4: what was set up, and the button into the app. */
export default async function DoneStepPage() {
  const org = await requireStep(4);
  const dl = await getDataLayer();
  const [expenses, clients, services] = await Promise.all([
    dl.expenses.list(),
    dl.clients.list(),
    dl.clientServices.list(),
  ]);

  const floorCents = floorFromSaved(expenses, org.tax_reserve_rate);
  const revenueCents = monthlyRevenueCents(clients, services, todayIso(org.timezone));

  return (
    <GlassPanel padding="lg" className="mx-auto max-w-3xl">
      <PageHeader title={`${org.name} is set up`} description="Here's where things stand. You can change any of this later." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Your floor" value={floorCents ? formatCents(floorCents) : "Not set"} hint={floorCents ? "per month" : "Add costs on Life vest"} />
        <Stat label="Clients" value={String(clients.length)} hint="Add more anytime" />
        <Stat label="Monthly revenue" value={formatCents(revenueCents)} hint="from recurring services" />
      </div>
      <FinishButton />
    </GlassPanel>
  );
}
