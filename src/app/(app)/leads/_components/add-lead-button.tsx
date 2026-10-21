"use client";

import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { createLead } from "../actions";
import { EMPTY_LEAD } from "../_lib/lead-form-values";
import { LeadFormDialog } from "./lead-form-dialog";

/** "Add lead" button and its dialog. New leads start in the New column. */
export function AddLeadButton() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button leftSection={<IconPlus size={18} aria-hidden />} onClick={open}>
        Add lead
      </Button>
      <LeadFormDialog
        opened={opened}
        onClose={close}
        title="Add a lead"
        initialValues={EMPTY_LEAD}
        action={createLead}
        submitLabel="Add lead"
      />
    </>
  );
}
