"use client";

import { Button, TextInput } from "@mantine/core";
import { useState } from "react";
import { BackButton } from "@/global/components/back-button";
import { FloorForm } from "@/global/components/floor/floor-form";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { IntervalSelect, MoneyInput, PercentInput } from "@/global/components/inputs";
import { Callout, EmptyState, FieldGrid, FormSection, PageHeader, Stat, StatusBadge } from "@/global/components/layout";
import { Stepper } from "@/global/components/stepper/stepper";
import type { ActionResult } from "@/global/lib/action-result";
import type { FloorFormValues } from "@/global/lib/schemas/floor";

/* Sample data only: /dev never touches the database. */
const SAMPLE_FLOOR: FloorFormValues = {
  expenses: {
    housing: 1500, food: 500, transportation: 250, health: 200, debt: "", subscriptions: 100,
    family: "", savings: 150, other_personal: "", software: 300, team: "", marketing: 250,
    development: 100, office: "", other_business: 200,
  },
  tax_rate: 28,
  estimated_revenue: "",
};

/** Stands in for a server action so the form can be tried without a database. */
async function fakeSave(): Promise<ActionResult> {
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true };
}

/** Every shared building block on one page, with sample data. */
export default function ComponentsShowcase() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex flex-col gap-8">
      <BackButton href="/dev" text="Dev" className="self-start" />
      <PageHeader title="Components" description="Shared building blocks, with sample data." actions={<Button>Primary action</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Collected this month" value="$3,500" hint="of $5,250 expected" />
        <Stat label="Overdue" value="$1,500" hint="1 payment to chase" />
        <Stat label="Pipeline" value="$3,100/mo" hint="4 open leads" />
      </div>

      <GlassPanel title="Inputs" description="Every Mantine input gets this look from the theme.">
        <FieldGrid cols={3}>
          <TextInput label="Business name" placeholder="Northline Studio" />
          <MoneyInput label="Housing" description="Mortgage or rent + utilities" defaultValue={1500} />
          <PercentInput label="Set aside for taxes" defaultValue={28} />
          <IntervalSelect label="How often" defaultValue="3" />
          <TextInput label="Email" defaultValue="not-an-email" error="Enter a valid email" />
          <TextInput label="Disabled" defaultValue="Can't edit" disabled />
        </FieldGrid>
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel title="Badges and callouts">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="ok">Paid</StatusBadge>
            <StatusBadge tone="bad">Overdue</StatusBadge>
            <StatusBadge tone="warn">Due today</StatusBadge>
            <StatusBadge tone="neutral">Expected</StatusBadge>
          </div>
          <Callout tone="ok" title="$650 above your $4,600 floor" />
          <Callout tone="warn" title="You'd be $930 short each month">Revenue $3,950 against a floor of $4,880.</Callout>
          <Callout tone="bad" title="Please check the highlighted fields." />
        </GlassPanel>
        <GlassPanel title="Stepper and empty state">
          <Stepper labels={["Your business", "Your floor", "Your clients", "Done"]} current={step} highest={2} onStepClick={setStep} />
          <FormSection title="A form section" aside="$2,700/mo">
            <p className="text-sm text-[var(--text-muted)]">Sections group fields and can show a running total.</p>
          </FormSection>
          <EmptyState title="No clients yet" description="Add the people who pay you, and what they pay." action={<Button>Add client</Button>} />
        </GlassPanel>
      </div>

      <FloorForm
        header={<h2 className="font-display text-2xl font-bold">FloorForm (onboarding and Life vest)</h2>}
        initialValues={SAMPLE_FLOOR}
        action={fakeSave}
        submitLabel="Save (does nothing here)"
      />
    </div>
  );
}
