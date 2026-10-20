import { Select, type SelectProps } from "@mantine/core";
import { BILLING_INTERVALS } from "@/global/lib/intervals";

/**
 * How often a client pays: Monthly, Quarterly, Every 6 months, Yearly.
 * Values are strings ("1", "3", …); schemas coerce them back to months.
 */
export function IntervalSelect(props: Omit<SelectProps, "data">) {
  return <Select data={[...BILLING_INTERVALS]} allowDeselect={false} {...props} />;
}
