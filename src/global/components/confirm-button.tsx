"use client";

import { Button, type ButtonProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactNode } from "react";
import { ConfirmDialog, type ConfirmDialogProps } from "./confirm-dialog";

type ConfirmButtonProps = Omit<ConfirmDialogProps, "opened" | "onClose"> & {
  /** The button that opens the dialog. */
  children: ReactNode;
  buttonProps?: ButtonProps & { "aria-label"?: string };
};

/** A button that asks "are you sure?" in a dialog before running an action. */
export function ConfirmButton({ children, buttonProps, ...dialog }: ConfirmButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button variant="subtle" color={dialog.danger ? "red" : "ink"} onClick={open} {...buttonProps}>
        {children}
      </Button>
      <ConfirmDialog opened={opened} onClose={close} {...dialog} />
    </>
  );
}
