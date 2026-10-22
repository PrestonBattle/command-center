"use client";

import { useState, useTransition } from "react";
import { useForm, type UseFormReturnType } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import type { z } from "zod";
import type { ActionResult } from "@/global/lib/action-result";
import { safeAction } from "@/global/lib/safe-action";

type Options<V> = {
  /** The same schema the server action uses. */
  schema: z.ZodType;
  /** A server action. On success it redirects or returns `{ ok: true }`. */
  action: (values: V) => Promise<ActionResult>;
  initialValues: V;
  /** "controlled" re-renders on every keystroke; use it when the UI shows live totals. */
  mode?: "controlled" | "uncontrolled";
  /** Runs after `{ ok: true }`, e.g. to close a modal or reset the form. */
  onSuccess?: () => void;
};

/**
 * A Mantine form wired to a server action:
 * - validates in the browser with the action's own zod schema
 * - sends the raw values to the action, which validates again
 * - puts server field errors back on the matching inputs
 * - tracks pending state (including while the action redirects)
 * - shows a form error, not a crash, when the action throws
 */
export function useActionForm<V extends Record<string, unknown>>({
  schema,
  action,
  initialValues,
  mode = "uncontrolled",
  onSuccess,
}: Options<V>): {
  form: UseFormReturnType<V>;
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  formError: string | null;
} {
  const form = useForm<V>({
    mode,
    initialValues,
    validate: zod4Resolver(schema),
    // Validate on submit, not on blur. Blur validation adds an error line
    // under the field as focus leaves it, which pushes the submit button
    // down mid-click: the press lands on the button, the release doesn't,
    // and the first click silently does nothing. Errors still clear as
    // soon as the field is edited (Mantine's clearInputErrorOnChange).
  });
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = form.onSubmit(
    (values) => {
      setFormError(null);
      startTransition(async () => {
        // safeAction turns a thrown action (signed out, offline, server
        // down) into a message on the form instead of a crashed page.
        const result = await safeAction(() => action(values));
        // A redirect never returns, so there's nothing to handle.
        if (!result) return;
        if (result.ok) {
          onSuccess?.();
          return;
        }
        if (result.fieldErrors) form.setErrors(result.fieldErrors);
        setFormError(result.formError ?? null);
      });
    },
    () => setFormError("Please check the highlighted fields."),
  );

  return { form, onSubmit, pending, formError };
}
