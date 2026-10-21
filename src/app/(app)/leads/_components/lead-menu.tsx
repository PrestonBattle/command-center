"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { ConfirmDialog } from "@/global/components/confirm-dialog";
import type { LeadRow } from "@/global/types/supabase/types";
import { deleteLead } from "../actions";

type LeadMenuProps = {
  lead: LeadRow;
  /** Opens the Edit dialog, which the card owns (its name opens it too). */
  onEdit: () => void;
};

/**
 * The "⋯" menu on a lead card: everything you do to a lead that isn't its
 * main button. Keeps the card itself short.
 */
export function LeadMenu({ lead, onEdit }: LeadMenuProps) {
  const [deleting, { open: askDelete, close: cancelDelete }] = useDisclosure(false);

  return (
    <>
      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon variant="subtle" color="ink" aria-label={`Actions for ${lead.name}`}>
            <IconDots size={18} aria-hidden />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconPencil size={16} aria-hidden />} onClick={onEdit}>
            Edit details
          </Menu.Item>
          <Menu.Item color="red" leftSection={<IconTrash size={16} aria-hidden />} onClick={askDelete}>
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <ConfirmDialog
        opened={deleting}
        onClose={cancelDelete}
        danger
        title={`Delete ${lead.name}?`}
        message="This removes the lead for good."
        confirmLabel="Delete lead"
        action={() => deleteLead(lead.id)}
      />
    </>
  );
}
