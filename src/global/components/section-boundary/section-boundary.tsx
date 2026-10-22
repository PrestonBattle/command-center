"use client";

import { Suspense, type ReactNode } from "react";
import { SectionError } from "./section-error";
import { SectionErrorBoundary } from "./section-error-boundary";

type SectionBoundaryProps = {
  /** Shown while the section's data loads. Shaped like the real section. */
  skeleton: ReactNode;
  /** Shown if it fails: "Couldn't load your clients." */
  errorMessage: string;
  /** The section. May be a server component; it stays one inside this. */
  children: ReactNode;
};

/**
 * The three states every data section has, in one place: loading
 * (skeleton), failed (message + retry, the rest of the page unaffected),
 * and loaded (the children). Pages wrap each section that receives a
 * promise in one of these. See "Pages and data" in CLAUDE.md.
 */
export function SectionBoundary({ skeleton, errorMessage, children }: SectionBoundaryProps) {
  return (
    <SectionErrorBoundary fallback={(reset) => <SectionError message={errorMessage} reset={reset} />}>
      <Suspense fallback={skeleton}>{children}</Suspense>
    </SectionErrorBoundary>
  );
}
