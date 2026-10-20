"use client";

import { Select, TextInput } from "@mantine/core";
import { useEffect } from "react";
import { Callout, FormActions } from "@/global/components/layout";
import { useActionForm } from "@/global/hooks/use-action-form";
import { saveBusiness } from "../../actions";
import { BUSINESS_TYPE_OPTIONS } from "../../_lib/constants";
import { businessSchema } from "../../_lib/schemas";

type Props = {
  defaultName: string;
  defaultType: string | null;
};

type Values = { name: string; business_type: string; timezone: string };

/** Step 1 form: business name and type. The timezone comes from the browser. */
export function BusinessForm({ defaultName, defaultType }: Props) {
  const { form, onSubmit, pending, formError } = useActionForm<Values>({
    schema: businessSchema,
    action: saveBusiness,
    initialValues: { name: defaultName, business_type: defaultType ?? "", timezone: "" },
  });

  // The browser knows the user's timezone; the server doesn't.
  useEffect(() => {
    form.setFieldValue("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <TextInput
        label="Business name"
        placeholder="Northline Studio"
        autoComplete="organization"
        withAsterisk
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <Select
        label="What kind of business?"
        description="Type to search"
        placeholder="Pick one"
        data={BUSINESS_TYPE_OPTIONS}
        searchable
        nothingFoundMessage="No match. Try “Other”."
        withAsterisk
        key={form.key("business_type")}
        {...form.getInputProps("business_type")}
      />
      {formError && <Callout tone="bad" role="alert" title={formError} />}
      <FormActions submitLabel="Continue" pending={pending} />
    </form>
  );
}
