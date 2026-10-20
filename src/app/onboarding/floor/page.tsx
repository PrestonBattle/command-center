import { BackButton } from "@/global/components/back-button";
import { FloorForm } from "@/global/components/floor/floor-form";
import { PageHeader } from "@/global/components/layout";
import { getDataLayer } from "@/global/data";
import { toFloorFormValues } from "@/global/lib/floor-form";
import { saveFloor } from "../actions";
import { pathForStep, requireStep } from "../_lib/steps";
import { SkipFloorButton } from "./_components/skip-floor-button";

/** Onboarding step 2: monthly costs, which set the floor. */
export default async function FloorStepPage() {
  const org = await requireStep(2);
  const expenses = await (await getDataLayer()).expenses.list();

  return (
    <FloorForm
      header={
        <PageHeader
          title="What does a month cost you?"
          description="Rough numbers are fine. Leave anything blank that doesn't apply."
        />
      }
      initialValues={toFloorFormValues(expenses, org)}
      action={saveFloor}
      submitLabel="Continue to clients"
      back={<BackButton href={pathForStep(1)} />}
      secondary={<SkipFloorButton />}
    />
  );
}
