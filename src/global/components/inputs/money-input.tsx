import { NumberInput, type NumberInputProps } from "@mantine/core";

/**
 * A dollar amount: `$` prefix, thousands commas, up to 2 decimals, never
 * negative. The value is dollars; zod schemas convert to cents on submit.
 * Any NumberInput prop overrides these defaults.
 */
export function MoneyInput(props: NumberInputProps) {
  return (
    <NumberInput
      prefix="$"
      thousandSeparator=","
      decimalScale={2}
      min={0}
      allowNegative={false}
      hideControls
      placeholder="$0"
      inputMode="decimal"
      {...props}
    />
  );
}
