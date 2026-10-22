"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";

/**
 * For error pages: logs the error once, moves focus to the heading so
 * keyboard and screen-reader users land on the explanation, and offers a
 * retry that re-runs the server render. `reset()` alone only re-renders on
 * the client, which shows the same error again when the failure came from a
 * server component (the usual case here: a query failed).
 */
export function useErrorRecovery(error: Error & { digest?: string }, reset: () => void) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const [retrying, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
    headingRef.current?.focus();
  }, [error]);

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return { headingRef, retry, retrying };
}
