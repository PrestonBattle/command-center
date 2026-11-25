"use client";

import { ActionIcon, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconPencil, IconStar, IconTrash } from "@tabler/icons-react";
import { ConfirmDialog } from "@/global/components/confirm-dialog";
import { Callout } from "@/global/components/layout";
import { useActionButton } from "@/global/hooks/use-action-button";
import type { ContactRow } from "@/global/types/supabase/types";
import { makePrimaryContact, removeContact } from "../../contact-actions";
import { EditContactForm } from "./edit-contact-form";

/**
 * The "⋯" menu on a contact: Edit, Make primary and Remove. It owns the
 * edit dialog and the are-you-sure, like the lead card's menu.
 */
export function ContactMenu({ contact }: { contact: ContactRow }) {
  const [editing, edit] = useDisclosure(false);
  const [removing, remove] = useDisclosure(false);
  const ref = { contactId: contact.id, clientId: contact.client_id };
  const primary = useActionButton(makePrimaryContact);

  return (
    <>
      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon variant="subtle" color="ink" size="lg" loading={primary.pending} aria-label={`Actions for ${contact.name}`}>
            <IconDots size={18} aria-hidden />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconPencil size={16} aria-hidden />} onClick={edit.open}>
            Edit
          </Menu.Item>
          {!contact.is_primary && (
            <Menu.Item leftSection={<IconStar size={16} aria-hidden />} onClick={() => primary.run(ref)}>
              Make primary
            </Menu.Item>
          )}
          <Menu.Item color="red" leftSection={<IconTrash size={16} aria-hidden />} onClick={remove.open}>
            Remove
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {primary.error && <Callout tone="bad" role="alert" title={primary.error} />}
      <Modal opened={editing} onClose={edit.close} title={`Edit ${contact.name}`} centered size="lg">
        <EditContactForm contact={contact} onDone={edit.close} />
      </Modal>
      <ConfirmDialog
        opened={removing}
        onClose={remove.close}
        danger
        title={`Remove ${contact.name}?`}
        message={
          contact.is_primary
            ? "They're the primary contact, so the next contact on this client becomes primary. The client and their payments aren't affected."
            : "The client and their payments aren't affected."
        }
        confirmLabel="Remove contact"
        action={() => removeContact(ref)}
      />
    </>
  );
}
