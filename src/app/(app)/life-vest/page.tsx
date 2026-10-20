import { PageHeader } from "@/global/components/layout";
import { revenueByClient } from "@/global/lib/billing";
import { sumExpenses } from "@/global/lib/floor";
import { toFloorFormValues } from "@/global/lib/floor-form";
import { loadBusiness } from "../_lib/load-business";
import { CoveragePanel } from "./_components/coverage-panel";
import { FloorEditor } from "./_components/floor-editor";
import { WhatIfPanel } from "./_components/what-if-panel";

/** The floor: how much revenue the business needs, how covered it is, and what could change that. */
export default async function LifeVestPage() {
  const data = await loadBusiness();
  const clients = revenueByClient(data.clients, data.services, data.today);
  const { personalCents, businessCents } = sumExpenses(data.expenses);

  return (
    <>
      <PageHeader title="Life vest" description="Your floor, and what would sink it." />
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <CoveragePanel
          revenueCents={data.revenueCents}
          floorCents={data.floorCents}
          revenueIsEstimate={data.revenueIsEstimate}
          biggestClient={clients[0] ?? null}
        />
        <WhatIfPanel
          clients={clients}
          revenueCents={data.revenueCents}
          personalCents={personalCents}
          businessCents={businessCents}
          taxRate={data.org.tax_reserve_rate}
        />
      </div>
      <FloorEditor initialValues={toFloorFormValues(data.expenses, data.org)} />
    </>
  );
}
