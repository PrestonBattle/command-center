"use client";

import { TextInput } from "@mantine/core";
import type { ReactNode } from "react";
import { IntervalSelect, MoneyInput } from "@/global/components/inputs";
import { Callout, FieldGrid, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import { clientRowSchema, EMPTY_CLIENT_ROW, type ClientRowFormValues } from "@/global/lib/schemas/client";
import { createClient } from "../../actions";

/** Name, email, and the recurring amount; same fields and rules as onboarding's rows. */
export function NewClientForm({ back }: { back: ReactNode }) {
  const { form, onSubmit, pending, formError } = useActionForm<ClientRowFormValues>({
    schema: clientRowSchema,
    action: createClient,
    initialValues: { ...EMPTY_CLIENT_ROW },
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <TextInput label="Client name" withAsterisk autoComplete="organization" key={form.key("name")} {...form.getInputProps("name")} />
      <TextInput label="Email (optional)" type="email" description="Becomes their main contact" key={form.key("email")} {...form.getInputProps("email")} />
      <FieldGrid cols={2}>
        <MoneyInput label="They pay" withAsterisk key={form.key("amount")} {...form.getInputProps("amount")} />
        <IntervalSelect label="How often" key={form.key("interval_months")} {...form.getInputProps("interval_months")} />
      </FieldGrid>
      {formError && <Callout tone="bad" role="alert" title={formError} />}
      <FormActions submitLabel="Add client" pending={pending} back={back} />
    </form>
  );
}
