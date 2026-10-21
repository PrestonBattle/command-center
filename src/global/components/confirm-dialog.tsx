"use client";

import { Button, Modal } from "@mantine/core";
import type { ReactNode } from "react";
import { Callout } from "@/global/components/layout";
import { useActionButton } from "@/global/hooks/use-action-button";
import type { ActionResult } from "@/global/lib/action-result";

export type ConfirmDialogProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  /** What will happen, in plain words. */
  message: ReactNode;
  confirmLabel: string;
  action: () => Promise<ActionResult>;
  /** Red confirm button for destructive actions. */
  danger?: boolean;
};

/**
 * The "are you sure?" dialog on its own, opened by whoever owns `opened`.
 * ConfirmButton wraps it with a button; menus open it from a menu item.
 * Closes itself when the action succeeds; shows the error if it doesn't.
 */
export function ConfirmDialog({ opened, onClose, title, message, confirmLabel, action, danger }: ConfirmDialogProps) {
  const { run, pending, error } = useActionButton(action, onClose);

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <div className="flex flex-col gap-4">
        <div className="text-sm">{message}</div>
        {error && <Callout tone="bad" role="alert" title={error} />}
        <div className="flex justify-end gap-2">
          <Button variant="subtle" color="ink" onClick={onClose}>Cancel</Button>
          <Button color={danger ? "red" : undefined} loading={pending} onClick={() => run()}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
