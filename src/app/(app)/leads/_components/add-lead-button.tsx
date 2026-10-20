"use client";

import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { MoneyInput } from "@/global/components/inputs";
import { Callout, FieldGrid, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import { createLead } from "../actions";
import { leadSchema, type LeadFormValues } from "../_lib/schemas";

const EMPTY: LeadFormValues = { name: "", contact_name: "", email: "", phone: "", estimated_monthly: "" };

/** "Add lead" button and its dialog. New leads start in the New column. */
export function AddLeadButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const { form, onSubmit, pending, formError } = useActionForm<LeadFormValues>({
    schema: leadSchema,
    action: createLead,
    initialValues: EMPTY,
    onSuccess: () => {
      form.reset();
      close();
    },
  });

  return (
    <>
      <Button leftSection={<IconPlus size={18} aria-hidden />} onClick={open}>
        Add lead
      </Button>
      <Modal opened={opened} onClose={close} title="Add a lead" centered size="lg">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <TextInput label="Business or person" withAsterisk data-autofocus key={form.key("name")} {...form.getInputProps("name")} />
          <FieldGrid cols={2}>
            <TextInput label="Contact name (optional)" autoComplete="name" key={form.key("contact_name")} {...form.getInputProps("contact_name")} />
            <TextInput label="Email (optional)" type="email" key={form.key("email")} {...form.getInputProps("email")} />
            <TextInput label="Phone (optional)" type="tel" key={form.key("phone")} {...form.getInputProps("phone")} />
            <MoneyInput label="Worth per month (optional)" description="Your best guess" key={form.key("estimated_monthly")} {...form.getInputProps("estimated_monthly")} />
          </FieldGrid>
          {formError && <Callout tone="bad" role="alert" title={formError} />}
          <FormActions submitLabel="Add lead" pending={pending} back={<Button variant="subtle" color="dark" onClick={close}>Cancel</Button>} />
        </form>
      </Modal>
    </>
  );
}
