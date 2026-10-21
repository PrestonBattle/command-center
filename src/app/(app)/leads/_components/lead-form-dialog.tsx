"use client";

import { Modal } from "@mantine/core";
import type { ComponentProps } from "react";
import { LeadForm } from "./lead-form";

type LeadFormDialogProps = Omit<ComponentProps<typeof LeadForm>, "onDone"> & {
  opened: boolean;
  onClose: () => void;
  title: string;
};

/**
 * LeadForm in a dialog. The form only mounts while open, so Edit always
 * starts from the lead's current values and Add always starts blank.
 */
export function LeadFormDialog({ opened, onClose, title, ...form }: LeadFormDialogProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered size="lg">
      <LeadForm {...form} onDone={onClose} />
    </Modal>
  );
}
