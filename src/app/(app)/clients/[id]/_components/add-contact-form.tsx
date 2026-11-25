"use client";

import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { Callout, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import { addContact } from "../../actions";
import { contactSchema, type ContactFormValues } from "../../_lib/schemas";
import { ContactFields } from "./contact-fields";

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
      <ContactFields form={form} />
      {formError && <Callout tone="bad" role="alert" title={formError} />}
      <FormActions submitLabel="Add contact" pending={pending} back={<Button variant="subtle" color="ink" onClick={close}>Cancel</Button>} />
    </form>
  );
}
