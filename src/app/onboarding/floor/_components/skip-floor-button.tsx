"use client";

import { Button } from "@mantine/core";
import { useActionButton } from "@/global/hooks/use-action-button";
import { skipFloor } from "../../actions";

/** "Finish later": moves on without saving. The Life vest page can fill it in. */
export function SkipFloorButton() {
  const { run, pending, error } = useActionButton(skipFloor);
  return (
    <>
      <Button variant="subtle" color="dark" size="md" loading={pending} onClick={() => run()}>
        Finish later
      </Button>
      {error && (
        <p role="alert" className="text-sm font-semibold text-[var(--bad)]">
          {error}
        </p>
      )}
    </>
  );
}
