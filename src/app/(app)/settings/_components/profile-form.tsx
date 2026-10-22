"use client";

import { TextInput } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { Callout, FieldGrid, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import { saveProfile } from "../actions";
import { notifySaved } from "../_lib/notify-saved";
import { profileSchema } from "../_lib/schemas";

type Values = { first_name: string; last_name: string; phone: string };
type Props = { initialValues: Values; email: string };

/**
 * Your name and phone. The email is shown but locked: it's how you sign in,
 * and changing a login belongs with the account security settings.
 */
export function ProfileForm({ initialValues, email }: Props) {
  const { form, onSubmit, pending, formError } = useActionForm<Values>({
    schema: profileSchema,
    action: saveProfile,
    initialValues,
    onSuccess: () => notifySaved("Your profile is updated."),
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FieldGrid cols={2}>
        <TextInput label="First name" autoComplete="given-name" withAsterisk key={form.key("first_name")} {...form.getInputProps("first_name")} />
        <TextInput label="Last name" autoComplete="family-name" withAsterisk key={form.key("last_name")} {...form.getInputProps("last_name")} />
      </FieldGrid>
      <TextInput label="Phone" type="tel" autoComplete="tel" key={form.key("phone")} {...form.getInputProps("phone")} />
      <TextInput
        label="Email"
        description="This is how you sign in. Changing it will come with account security settings."
        value={email}
        readOnly
        rightSection={<IconLock size={16} aria-hidden />}
        classNames={{ input: "cursor-default text-[var(--text-muted)]" }}
      />
      {formError && <Callout tone="bad" role="alert" title={formError} />}
      <FormActions submitLabel="Save profile" pending={pending} />
    </form>
  );
}
