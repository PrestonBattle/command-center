"use client";

import type { ReactNode } from "react";
import { Callout, FieldGrid, FormActions } from "@/global/components/layout";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { MoneyInput, PercentInput } from "@/global/components/inputs";
import { useActionForm } from "@/global/hooks/use-action-form";
import type { ActionResult } from "@/global/lib/action-result";
import { BUSINESS_CATEGORIES, PERSONAL_CATEGORIES } from "@/global/lib/expense-categories";
import { previewFloor } from "@/global/lib/floor-form";
import { floorSchema, type FloorFormValues } from "@/global/lib/schemas/floor";
import { ExpenseFields } from "./expense-fields";
import { FloorSummary } from "./floor-summary";

type FloorFormProps = {
  initialValues: FloorFormValues;
  /** saveFloor in onboarding, updateFloor on the Life vest page. */
  action: (values: FloorFormValues) => Promise<ActionResult>;
  submitLabel: string;
  back?: ReactNode;
  secondary?: ReactNode;
  onSuccess?: () => void;
  /** Rendered above the fields, e.g. the step's PageHeader. */
  header?: ReactNode;
};

/**
 * Monthly expenses, tax set-aside and revenue estimate, with the floor
 * recalculated live beside them. Controlled mode, because the summary has
 * to re-render on every keystroke.
 */
export function FloorForm({ initialValues, action, submitLabel, back, secondary, onSuccess, header }: FloorFormProps) {
  const { form, onSubmit, pending, formError } = useActionForm<FloorFormValues>({
    schema: floorSchema,
    action,
    initialValues,
    mode: "controlled",
    onSuccess,
  });
  const values = form.getValues();
  const breakdown = previewFloor(values);
  const taxPercent = values.tax_rate === "" ? 25 : Number(values.tax_rate);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <GlassPanel padding="lg">
        {header}
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
          <ExpenseFields title="Personal" categories={PERSONAL_CATEGORIES} totalCents={breakdown.personalCents} form={form} />
          <ExpenseFields title="Business" categories={BUSINESS_CATEGORIES} totalCents={breakdown.businessCents} form={form} />
          <FieldGrid cols={2}>
            <PercentInput
              label="Set aside for taxes"
              description="Leave blank to use 25%"
              key={form.key("tax_rate")}
              {...form.getInputProps("tax_rate")}
            />
            <MoneyInput
              label="What you bring in now (optional)"
              description="Monthly. Used until you add clients"
              key={form.key("estimated_revenue")}
              {...form.getInputProps("estimated_revenue")}
            />
          </FieldGrid>
          {formError && <Callout tone="bad" role="alert" title={formError} />}
          <FormActions submitLabel={submitLabel} pending={pending} back={back} secondary={secondary} />
        </form>
      </GlassPanel>
      <FloorSummary breakdown={breakdown} taxPercent={Number.isFinite(taxPercent) ? taxPercent : 25} />
    </div>
  );
}
