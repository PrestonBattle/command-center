"use client";

import { Button } from "@mantine/core";
import { useSectionRetry } from "@/global/hooks/use-section-retry";
import { Callout } from "../layout/callout";

type SectionErrorProps = {
  /** "Couldn't load your clients." Say which part, in plain words. */
  message: string;
  reset: () => void;
};

/** What a failed section shows instead of itself: what didn't load, and a retry. */
export function SectionError({ message, reset }: SectionErrorProps) {
  const { retry, retrying } = useSectionRetry(reset);
  return (
    <Callout tone="bad" role="alert" title={message}>
      <div className="flex flex-wrap items-center gap-3">
        <span>The rest of the page is fine. Try this part again.</span>
        <Button size="compact-md" variant="subtle" color="ink" onClick={retry} loading={retrying}>
          Try again
        </Button>
      </div>
    </Callout>
  );
}
