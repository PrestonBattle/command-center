import { NumberInput, type NumberInputProps } from "@mantine/core";

/**
 * A percentage the user types as a whole number (28 means 28%). The schema
 * turns it into a fraction. Capped at 60 because a higher tax set-aside is
 * almost certainly a typo.
 */
export function PercentInput(props: NumberInputProps) {
  return (
    <NumberInput
      suffix="%"
      min={0}
      max={60}
      decimalScale={1}
      allowNegative={false}
      clampBehavior="strict"
      hideControls
      inputMode="decimal"
      {...props}
    />
  );
}
