"use client";

import { Button, Select, TextInput } from "@mantine/core";
import { Callout, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import { BUSINESS_TYPE_OPTIONS } from "@/global/lib/business-types";
import type { TimezoneGroup } from "@/global/lib/timezones";
import { saveBusinessSettings } from "../actions";
import { notifySaved } from "../_lib/notify-saved";
import { businessSettingsSchema } from "../_lib/schemas";

type Values = { name: string; business_type: string; timezone: string };
type Props = { initialValues: Values; timezones: TimezoneGroup[] };

/** Business name, type and timezone. Saves on its own, separate from the profile. */
export function BusinessSettingsForm({ initialValues, timezones }: Props) {
  const { form, onSubmit, pending, formError } = useActionForm<Values>({
    schema: businessSettingsSchema,
    action: saveBusinessSettings,
    initialValues,
    onSuccess: () => notifySaved("Your business details are updated."),
  });
  // Read when clicked, not on render: the server can't know it, and reading
  // it during render would differ between server and browser.
  const pickDeviceZone = () => form.setFieldValue("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <TextInput label="Business name" autoComplete="organization" withAsterisk key={form.key("name")} {...form.getInputProps("name")} />
      <Select
        label="What kind of business?"
        data={BUSINESS_TYPE_OPTIONS}
        searchable
        nothingFoundMessage="No match. Try “Other”."
        withAsterisk
        key={form.key("business_type")}
        {...form.getInputProps("business_type")}
      />
      <div className="flex flex-col gap-1">
        <Select
          label="Timezone"
          description="Sets “today”: when payments are due and overdue, and your greeting."
          data={timezones}
          searchable
          nothingFoundMessage="No match. Try a city name."
          withAsterisk
          key={form.key("timezone")}
          {...form.getInputProps("timezone")}
        />
        <Button variant="subtle" color="ink" size="compact-md" className="self-start" onClick={pickDeviceZone}>
          Use this device&apos;s timezone
        </Button>
      </div>
      {formError && <Callout tone="bad" role="alert" title={formError} />}
      <FormActions submitLabel="Save business" pending={pending} />
    </form>
  );
}
