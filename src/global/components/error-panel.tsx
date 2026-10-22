"use client";

import { Button } from "@mantine/core";
import type { Ref } from "react";
import { ButtonLink } from "./button-link";
import { GlassPanel } from "./glass/glass-panel";

type ErrorPanelProps = {
  /** Focused on arrival, so the explanation is the first thing read. */
  headingRef: Ref<HTMLHeadingElement>;
  onRetry: () => void;
  retrying: boolean;
  /** Next's id for this error in the server logs, to quote when reporting it. */
  digest?: string;
  href?: string;
  linkLabel?: string;
};

/**
 * The body of an error page: what happened in plain words, a retry, and a
 * way home. The sibling of NotFoundPanel. Says nothing technical; the
 * reference code is there for support, not for the reader.
 */
export function ErrorPanel({ headingRef, onRetry, retrying, digest, href = "/", linkLabel = "Back to dashboard" }: ErrorPanelProps) {
  return (
    <GlassPanel padding="lg" className="mx-auto mt-10 max-w-md items-center text-center">
      <h1 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-bold outline-none">
        Something went wrong
      </h1>
      <p className="text-[var(--text-muted)]">
        This page didn&apos;t load. Try again, and if it keeps happening, come back in a few minutes.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={onRetry} loading={retrying}>
          Try again
        </Button>
        <ButtonLink href={href} variant="default" color="ink">
          {linkLabel}
        </ButtonLink>
      </div>
      {digest && <p className="text-xs text-[var(--text-muted)]">Reference: {digest}</p>}
    </GlassPanel>
  );
}
