"use client";

import { Button, TextInput } from "@mantine/core";
import { MoneyInput } from "@/global/components/inputs";
import { Callout, FieldGrid, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import type { ActionResult } from "@/global/lib/action-result";
import { leadSchema, type LeadFormValues } from "../_lib/schemas";

type LeadFormProps = {
  initialValues: LeadFormValues;
  /** createLead for Add; updateLead bound to the lead's id for Edit. */
  action: (values: LeadFormValues) => Promise<ActionResult>;
  submitLabel: string;
  /** Called after a successful save, and by Cancel. */
  onDone: () => void;
};

/**
 * A lead's details, shared by Add and Edit so the two can't drift apart.
 * Stage isn't here: dragging and "Move to…" change it.
 */
export function LeadForm({ initialValues, action, submitLabel, onDone }: LeadFormProps) {
  const { form, onSubmit, pending, formError } = useActionForm<LeadFormValues>({
    schema: leadSchema,
    action,
    initialValues,
    onSuccess: onDone,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <TextInput label="Business or person" withAsterisk data-autofocus key={form.key("name")} {...form.getInputProps("name")} />
      <FieldGrid cols={2}>
        <TextInput label="Contact name (optional)" autoComplete="name" key={form.key("contact_name")} {...form.getInputProps("contact_name")} />
        <TextInput label="Email (optional)" type="email" key={form.key("email")} {...form.getInputProps("email")} />
        <TextInput label="Phone (optional)" type="tel" key={form.key("phone")} {...form.getInputProps("phone")} />
        <MoneyInput label="Worth per month (optional)" description="Your best guess" key={form.key("estimated_monthly")} {...form.getInputProps("estimated_monthly")} />
      </FieldGrid>
      {formError && <Callout tone="bad" role="alert" title={formError} />}
      <FormActions submitLabel={submitLabel} pending={pending} back={<Button variant="subtle" color="ink" onClick={onDone}>Cancel</Button>} />
    </form>
  );
}
