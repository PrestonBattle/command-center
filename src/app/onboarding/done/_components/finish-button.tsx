"use client";

import { Button } from "@mantine/core";
import { Callout } from "@/global/components/layout";
import { useActionButton } from "@/global/hooks/use-action-button";
import { finishOnboarding } from "../../actions";

/** Marks onboarding finished and opens the dashboard. */
export function FinishButton() {
  const { run, pending, error } = useActionButton(finishOnboarding);
  return (
    <div className="flex flex-col items-end gap-3">
      {error && <Callout tone="bad" role="alert" title={error} />}
      <Button size="md" loading={pending} onClick={() => run()}>
        Go to my dashboard
      </Button>
    </div>
  );
}
