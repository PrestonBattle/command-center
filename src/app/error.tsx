"use client";

import { ErrorPanel } from "@/global/components/error-panel";
import { useErrorRecovery } from "@/global/hooks/use-error-recovery";

type Props = { error: Error & { digest?: string }; reset: () => void };

/**
 * A page outside the app shell threw: onboarding, login, signup, or the app
 * layout itself. No navbar here, so the link goes home; the auth gate
 * sends people on to login or onboarding from there.
 */
export default function RootError({ error, reset }: Props) {
  const { headingRef, retry, retrying } = useErrorRecovery(error, reset);
  return (
    <main className="px-4 py-12">
      <ErrorPanel headingRef={headingRef} onRetry={retry} retrying={retrying} digest={error.digest} linkLabel="Go home" />
    </main>
  );
}
