"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { ConfirmDialog } from "@/global/components/confirm-dialog";
import { LEAD_STAGES } from "@/global/lib/lead-stages";
import type { LeadRow, LeadStage } from "@/global/types/supabase/types";
import { deleteLead } from "../actions";

type LeadMenuProps = {
  lead: LeadRow;
  /** Opens the Edit dialog, which the card owns (its name opens it too). */
  onEdit: () => void;
  onMove: (to: LeadStage) => void;
};

/**
 * The "⋯" menu on a lead card. "Move to" is the way to change stage
 * without dragging: required for anyone who can't drag (WCAG 2.5.7), and
 * the only way on phones, where one column shows at a time.
 */
export function LeadMenu({ lead, onEdit, onMove }: LeadMenuProps) {
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
          <Menu.Label>Move to</Menu.Label>
          {LEAD_STAGES.filter((s) => s.value !== lead.stage).map((s) => (
            <Menu.Item
              key={s.value}
              leftSection={<IconArrowRight size={16} aria-hidden />}
              aria-label={`Move to ${s.label}`}
              onClick={() => onMove(s.value)}
            >
              {s.label}
            </Menu.Item>
          ))}
          <Menu.Divider />
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
