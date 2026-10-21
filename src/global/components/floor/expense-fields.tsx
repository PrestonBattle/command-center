import type { UseFormReturnType } from "@mantine/form";
import { FieldGrid, FormSection } from "@/global/components/layout";
import { MoneyInput } from "@/global/components/inputs";
import type { ExpenseCategory } from "@/global/lib/expense-categories";
import { formatCents } from "@/global/lib/money";
import type { FloorFormValues } from "@/global/lib/schemas/floor";

type ExpenseFieldsProps = {
  title: string;
  categories: readonly ExpenseCategory[];
  totalCents: number;
  form: UseFormReturnType<FloorFormValues>;
};

/** One section of expense inputs (Personal or Business) with its running total. */
export function ExpenseFields({ title, categories, totalCents, form }: ExpenseFieldsProps) {
  return (
    <FormSection title={title} aside={`${formatCents(totalCents)}/mo`}>
      <FieldGrid cols={3}>
        {categories.map((c) => (
          <MoneyInput
            key={form.key(`expenses.${c.key}`)}
            label={c.label}
            description={c.hint}
            {...form.getInputProps(`expenses.${c.key}`)}
          />
        ))}
      </FieldGrid>
    </FormSection>
  );
}
