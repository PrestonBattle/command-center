"use client";

import { TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { FieldGrid } from "@/global/components/layout";
import type { ContactFormValues } from "../../_lib/schemas";

type Props<V extends ContactFormValues> = { form: UseFormReturnType<V> };

/** A contact's four fields, shared by Add and Edit so the two can't drift apart. */
export function ContactFields<V extends ContactFormValues>({ form }: Props<V>) {
  return (
    <FieldGrid cols={2}>
      <TextInput label="Name" withAsterisk autoComplete="name" data-autofocus key={form.key("name")} {...form.getInputProps("name")} />
      <TextInput label="Role (optional)" placeholder="Office manager" key={form.key("role")} {...form.getInputProps("role")} />
      <TextInput label="Email (optional)" type="email" autoComplete="email" key={form.key("email")} {...form.getInputProps("email")} />
      <TextInput label="Phone (optional)" type="tel" autoComplete="tel" key={form.key("phone")} {...form.getInputProps("phone")} />
    </FieldGrid>
  );
}
