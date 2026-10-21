"use client";

import { Button, Modal, type ButtonProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactNode } from "react";
import { Callout } from "@/global/components/layout";
import { useActionButton } from "@/global/hooks/use-action-button";
import type { ActionResult } from "@/global/lib/action-result";

type ConfirmButtonProps = {
  /** The button that opens the dialog. */
  children: ReactNode;
  title: string;
  /** What will happen, in plain words. */
  message: ReactNode;
  confirmLabel: string;
  action: () => Promise<ActionResult>;
  /** Red confirm button for destructive actions. */
  danger?: boolean;
  buttonProps?: ButtonProps & { "aria-label"?: string };
};

/** A button that asks "are you sure?" in a dialog before running an action. */
export function ConfirmButton({ children, title, message, confirmLabel, action, danger, buttonProps }: ConfirmButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { run, pending, error } = useActionButton(action, close);

  return (
    <>
      <Button variant="subtle" color={danger ? "red" : "ink"} onClick={open} {...buttonProps}>
        {children}
      </Button>
      <Modal opened={opened} onClose={close} title={title} centered>
        <div className="flex flex-col gap-4">
          <div className="text-sm">{message}</div>
          {error && <Callout tone="bad" role="alert" title={error} />}
          <div className="flex justify-end gap-2">
            <Button variant="subtle" color="ink" onClick={close}>Cancel</Button>
            <Button color={danger ? "red" : undefined} loading={pending} onClick={() => run()}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
