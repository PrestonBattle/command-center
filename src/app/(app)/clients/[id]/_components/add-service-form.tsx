"use client";

import { Button, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { IntervalSelect, MoneyInput } from "@/global/components/inputs";
import { Callout, FieldGrid, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import { addService } from "../../actions";
import { serviceSchema, type ServiceFormValues } from "../../_lib/schemas";

/** "Add a service": collapsed to a button until needed. */
export function AddServiceForm({ clientId, today }: { clientId: string; today: string }) {
  const [opened, { open, close }] = useDisclosure(false);
  const initial: ServiceFormValues = { clientId, name: "", amount: "", interval_months: "1", started_on: today };
  const { form, onSubmit, pending, formError } = useActionForm<ServiceFormValues>({
    schema: serviceSchema,
    action: addService,
    initialValues: initial,
    onSuccess: () => {
      form.reset();
      close();
    },
  });

  if (!opened) {
    return (
      <Button variant="light" className="self-start" leftSection={<IconPlus size={16} aria-hidden />} onClick={open}>
        Add a service
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-2xl bg-[var(--surface-inset)] p-4">
      <TextInput label="Service" placeholder="Monthly retainer" withAsterisk data-autofocus key={form.key("name")} {...form.getInputProps("name")} />
      <FieldGrid cols={3}>
        <MoneyInput label="Amount" withAsterisk key={form.key("amount")} {...form.getInputProps("amount")} />
        <IntervalSelect label="How often" key={form.key("interval_months")} {...form.getInputProps("interval_months")} />
        <TextInput label="Starts" type="date" key={form.key("started_on")} {...form.getInputProps("started_on")} />
      </FieldGrid>
      {formError && <Callout tone="bad" role="alert" title={formError} />}
      <FormActions submitLabel="Add service" pending={pending} back={<Button variant="subtle" color="dark" onClick={close}>Cancel</Button>} />
    </form>
  );
}
