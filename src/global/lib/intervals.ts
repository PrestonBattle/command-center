/** Billing intervals people pick from. Values are strings because Select works in strings. */
export const BILLING_INTERVALS = [
  { value: "1", label: "Monthly" },
  { value: "3", label: "Quarterly" },
  { value: "6", label: "Every 6 months" },
  { value: "12", label: "Yearly" },
] as const;

/** "Monthly", "Quarterly", … for a number of months, or "Every N months". */
export function intervalLabel(months: number): string {
  return (
    BILLING_INTERVALS.find((i) => Number(i.value) === months)?.label ??
    `Every ${months} months`
  );
}
