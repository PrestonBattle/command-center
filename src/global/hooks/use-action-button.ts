"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/global/lib/action-result";
import { safeAction } from "@/global/lib/safe-action";

/**
 * For buttons that call a server action without a form: Skip, Finish,
 * Mark paid, Delete. Tracks pending state and the error message; a thrown
 * action (signed out, offline) becomes the error message too.
 */
export function useActionButton<A extends unknown[]>(
  action: (...args: A) => Promise<ActionResult>,
  onSuccess?: () => void,
) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(...args: A) {
    setError(null);
    startTransition(async () => {
      const result = await safeAction(() => action(...args));
      if (!result) return; // redirected
      if (result.ok) onSuccess?.();
      else setError(result.formError ?? "Something went wrong. Try again.");
    });
  }

  return { run, pending, error };
}
