"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Retry for one failed section. A section's data comes from the server
 * render, so retrying means asking the server for a fresh render and then
 * clearing the section's error so it can show the new result. Clearing the
 * error alone would just re-throw the same failed promise.
 */
export function useSectionRetry(reset: () => void) {
  const router = useRouter();
  const [retrying, startTransition] = useTransition();

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return { retry, retrying };
}
