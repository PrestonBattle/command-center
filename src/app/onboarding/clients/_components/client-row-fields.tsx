import { ActionIcon, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { IntervalSelect, MoneyInput } from "@/global/components/inputs";
import type { ClientRowFormValues } from "@/global/lib/schemas/client";

type Props = {
  form: UseFormReturnType<{ clients: ClientRowFormValues[] }>;
  index: number;
  onRemove: () => void;
};

/**
 * One editable client row. Every input has a real label; on desktop the
 * first row's labels act as column headers and later rows hide theirs
 * visually (still read by screen readers).
 */
export function ClientRowFields({ form, index, onRemove }: Props) {
  const path = (field: keyof ClientRowFormValues) => `clients.${index}.${field}`;
  const labelProps = { className: index > 0 ? "sm:sr-only" : undefined };
  const rowName = form.getValues().clients[index]?.name || `row ${index + 1}`;

  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl bg-[var(--surface-inset)] p-3 sm:grid-cols-[1.3fr_1.6fr_1fr_1fr_44px] sm:items-end sm:bg-transparent sm:p-0">
      <TextInput label="Client name" labelProps={labelProps} key={form.key(path("name"))} {...form.getInputProps(path("name"))} />
      <TextInput label="Email (optional)" type="email" labelProps={labelProps} key={form.key(path("email"))} {...form.getInputProps(path("email"))} />
      <MoneyInput label="Amount" labelProps={labelProps} key={form.key(path("amount"))} {...form.getInputProps(path("amount"))} />
      <IntervalSelect label="Billed" labelProps={labelProps} key={form.key(path("interval_months"))} {...form.getInputProps(path("interval_months"))} />
      <ActionIcon
        variant="subtle"
        color="ink"
        size={44}
        aria-label={`Remove ${rowName}`}
        onClick={onRemove}
        className="justify-self-end"
      >
        <IconTrash size={18} aria-hidden />
      </ActionIcon>
    </div>
  );
}
