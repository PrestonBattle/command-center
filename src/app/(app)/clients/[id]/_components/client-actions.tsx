"use client";

import { Select } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { ConfirmButton } from "@/global/components/confirm-button";
import { useActionButton } from "@/global/hooks/use-action-button";
import { CLIENT_STATUSES } from "@/global/lib/client-status";
import type { ClientRow } from "@/global/types/supabase/types";
import { deleteClient, updateClientStatus } from "../../actions";
import { EditClientButton } from "./edit-client-button";

type Props = { client: Pick<ClientRow, "id" | "name" | "status" | "website" | "signed_on" | "notes"> };

/** Status picker, Edit details and Delete, in the page header. */
export function ClientActions({ client }: Props) {
  const { id: clientId, name: clientName, status } = client;
  const update = useActionButton(updateClientStatus);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        aria-label="Client status"
        data={CLIENT_STATUSES.map(({ value, label }) => ({ value, label }))}
        defaultValue={status}
        allowDeselect={false}
        disabled={update.pending}
        error={update.error}
        onChange={(v) => v && update.run({ clientId, status: v })}
        className="w-40"
      />
      <EditClientButton client={client} />
      <ConfirmButton
        danger
        title={`Delete ${clientName}?`}
        message="Their contacts, services and payment history are deleted too. This can't be undone. To stop billing but keep the history, set them to Ended instead."
        confirmLabel="Delete client"
        action={() => deleteClient(clientId)}
        buttonProps={{ leftSection: <IconTrash size={16} aria-hidden /> }}
      >
        Delete
      </ConfirmButton>
    </div>
  );
}
