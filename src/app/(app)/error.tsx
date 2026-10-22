"use client";

import { ErrorPanel } from "@/global/components/error-panel";
import { useErrorRecovery } from "@/global/hooks/use-error-recovery";

type Props = { error: Error & { digest?: string }; reset: () => void };

/**
 * A signed-in page threw (usually a query failed). Shown inside the app
 * shell, so the navbar stays and the rest of the app is one click away.
 */
export default function AppError({ error, reset }: Props) {
  const { headingRef, retry, retrying } = useErrorRecovery(error, reset);
  return <ErrorPanel headingRef={headingRef} onRetry={retry} retrying={retrying} digest={error.digest} />;
}
