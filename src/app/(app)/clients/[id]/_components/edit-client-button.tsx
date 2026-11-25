"use client";

import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import type { ClientRow } from "@/global/types/supabase/types";
import { EditClientForm } from "./edit-client-form";

type Props = { client: Pick<ClientRow, "id" | "name" | "website" | "signed_on" | "notes"> };

/**
 * "Edit details" and its dialog. The form only mounts while open, so it
 * always starts from the client's saved values.
 */
export function EditClientButton({ client }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button variant="light" color="ink" leftSection={<IconPencil size={16} aria-hidden />} onClick={open}>
        Edit details
      </Button>
      <Modal opened={opened} onClose={close} title={`Edit ${client.name}`} centered size="lg">
        <EditClientForm
          onDone={close}
          initialValues={{
            clientId: client.id,
            name: client.name,
            website: client.website ?? "",
            signed_on: client.signed_on,
            notes: client.notes ?? "",
          }}
        />
      </Modal>
    </>
  );
}
