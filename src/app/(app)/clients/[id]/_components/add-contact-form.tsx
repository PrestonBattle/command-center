"use client";

import { Button, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { Callout, FieldGrid, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import { addContact } from "../../actions";
import { contactSchema, type ContactFormValues } from "../../_lib/schemas";

/** "Add a contact": collapsed to a button until needed. */
export function AddContactForm({ clientId }: { clientId: string }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { form, onSubmit, pending, formError } = useActionForm<ContactFormValues>({
    schema: contactSchema,
    action: addContact,
    initialValues: { clientId, name: "", role: "", email: "", phone: "" },
    onSuccess: () => {
      form.reset();
      close();
    },
  });

  if (!opened) {
    return (
      <Button variant="light" className="self-start" leftSection={<IconPlus size={16} aria-hidden />} onClick={open}>
        Add a contact
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-2xl bg-[var(--surface-inset)] p-4">
      <FieldGrid cols={2}>
        <TextInput label="Name" withAsterisk autoComplete="name" key={form.key("name")} {...form.getInputProps("name")} />
        <TextInput label="Role (optional)" placeholder="Office manager" key={form.key("role")} {...form.getInputProps("role")} />
        <TextInput label="Email (optional)" type="email" autoComplete="email" key={form.key("email")} {...form.getInputProps("email")} />
        <TextInput label="Phone (optional)" type="tel" autoComplete="tel" key={form.key("phone")} {...form.getInputProps("phone")} />
      </FieldGrid>
      {formError && <Callout tone="bad" role="alert" title={formError} />}
      <FormActions submitLabel="Add contact" pending={pending} back={<Button variant="subtle" color="dark" onClick={close}>Cancel</Button>} />
    </form>
  );
}
