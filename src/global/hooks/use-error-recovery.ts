"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { sendClientError } from "@/global/lib/log/send-client-error";

/**
 * For error pages: reports the error to the server logs once, moves focus to the heading so
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
    // Server errors arrive here as a digest only (Next hides the message);
    // the full error is already logged under that digest by
    // instrumentation.ts. Browser errors are only logged by this.
    sendClientError("client:page", error);
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
