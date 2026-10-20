import type { ReactNode } from "react";
import { Button } from "@mantine/core";

type FormActionsProps = {
  /** Label on the submit button. */
  submitLabel: string;
  pending?: boolean;
  /** Left side, usually a Back link or button. */
  back?: ReactNode;
  /** Between back and submit, e.g. "Finish later". */
  secondary?: ReactNode;
};

/** The row at the bottom of a form: back on the left, secondary and submit on the right. */
export function FormActions({ submitLabel, pending, back, secondary }: FormActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div>{back}</div>
      <div className="flex flex-wrap items-center gap-2">
        {secondary}
        <Button type="submit" size="md" loading={pending}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
