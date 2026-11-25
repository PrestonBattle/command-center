"use client";

import { Button } from "@mantine/core";
import { Callout, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import type { ContactRow } from "@/global/types/supabase/types";
import { updateContact } from "../../contact-actions";
import { contactUpdateSchema, type ContactUpdateFormValues } from "../../_lib/contact-schemas";
import { ContactFields } from "./contact-fields";

type Props = {
  contact: ContactRow;
  /** Called after a successful save, and by Cancel. */
  onDone: () => void;
};

/** Edit one contact, starting from their saved details. */
export function EditContactForm({ contact, onDone }: Props) {
  const { form, onSubmit, pending, formError } = useActionForm<ContactUpdateFormValues>({
    schema: contactUpdateSchema,
    action: updateContact,
    initialValues: {
      contactId: contact.id,
      clientId: contact.client_id,
      name: contact.name,
      role: contact.role ?? "",
      email: contact.email ?? "",
      phone: contact.phone ?? "",
    },
    onSuccess: onDone,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <ContactFields form={form} />
      {formError && <Callout tone="bad" role="alert" title={formError} />}
      <FormActions submitLabel="Save contact" pending={pending} back={<Button variant="subtle" color="ink" onClick={onDone}>Cancel</Button>} />
    </form>
  );
}
