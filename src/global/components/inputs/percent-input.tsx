import { NumberInput, type NumberInputProps } from "@mantine/core";

/**
 * A percentage the user types as a whole number (28 means 28%). The schema
 * turns it into a fraction. Capped at 60 because a higher tax set-aside is
 * almost certainly a typo. The schema enforces the cap with a message;
 * the input never clamps, so a typed 90 is never silently saved as 60.
 */
export function PercentInput(props: NumberInputProps) {
  return (
    <NumberInput
      suffix="%"
      min={0}
      max={60}
      decimalScale={1}
      allowNegative={false}
      clampBehavior="none"
      hideControls
      inputMode="decimal"
      {...props}
    />
  );
}
