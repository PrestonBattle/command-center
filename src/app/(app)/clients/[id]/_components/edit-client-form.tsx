"use client";

import { Button, Textarea, TextInput } from "@mantine/core";
import { Callout, FieldGrid, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import { updateClient } from "../../actions";
import { clientDetailsSchema, type ClientDetailsFormValues } from "../../_lib/schemas";

type Props = {
  initialValues: ClientDetailsFormValues;
  /** Called after a successful save, and by Cancel. */
  onDone: () => void;
};

/** The client's name, website, start date and notes. */
export function EditClientForm({ initialValues, onDone }: Props) {
  const { form, onSubmit, pending, formError } = useActionForm<ClientDetailsFormValues>({
    schema: clientDetailsSchema,
    action: updateClient,
    initialValues,
    onSuccess: onDone,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <TextInput label="Name" withAsterisk data-autofocus key={form.key("name")} {...form.getInputProps("name")} />
      <FieldGrid cols={2}>
        <TextInput label="Website (optional)" type="url" inputMode="url" placeholder="acme.com" key={form.key("website")} {...form.getInputProps("website")} />
        <TextInput label="Client since" type="date" withAsterisk key={form.key("signed_on")} {...form.getInputProps("signed_on")} />
      </FieldGrid>
      <Textarea label="Notes (optional)" autosize minRows={3} maxRows={8} key={form.key("notes")} {...form.getInputProps("notes")} />
      {formError && <Callout tone="bad" role="alert" title={formError} />}
      <FormActions submitLabel="Save details" pending={pending} back={<Button variant="subtle" color="ink" onClick={onDone}>Cancel</Button>} />
    </form>
  );
}
