"use client";

import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { BackButton } from "@/global/components/back-button";
import { Callout, FormActions } from "@/global/components/layout";
import { useActionButton } from "@/global/hooks/use-action-button";
import { useActionForm } from "@/global/hooks/use-action-form";
import { formatCents } from "@/global/lib/money";
import { EMPTY_CLIENT_ROW, type ClientRowFormValues } from "@/global/lib/schemas/client";
import { saveClients } from "../../actions";
import { pathForStep } from "../../_lib/constants";
import { clientsSchema } from "../../_lib/schemas";
import { previewRevenue } from "../_lib/preview-revenue";
import { ClientRowFields } from "./client-row-fields";
import { CsvImport } from "./csv-import";

type Values = { clients: ClientRowFormValues[] };

/** Step 3: type clients in or import them, with a running total against the floor. */
export function ClientsStepForm({ floorCents }: { floorCents: number }) {
  const { form, onSubmit, pending, formError } = useActionForm<Values>({
    schema: clientsSchema,
    action: saveClients,
    initialValues: { clients: [{ ...EMPTY_CLIENT_ROW }] },
    mode: "controlled",
  });
  const skip = useActionButton(() => saveClients({ clients: [] }));

  const rows = form.getValues().clients;
  const { count, monthlyCents } = previewRevenue(rows);
  const gap = monthlyCents - floorCents;

  function importRows(imported: ClientRowFormValues[]) {
    const kept = rows.filter((r) => r.name.trim() || String(r.amount).trim());
    form.setFieldValue("clients", [...kept, ...imported]);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Your regular clients</h2>
        <CsvImport onImport={importRows} />
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((_, i) => (
          <ClientRowFields key={i} form={form} index={i} onRemove={() => form.removeListItem("clients", i)} />
        ))}
      </div>

      <Button
        variant="subtle"
        className="self-start"
        leftSection={<IconPlus size={16} aria-hidden />}
        onClick={() => form.insertListItem("clients", { ...EMPTY_CLIENT_ROW })}
      >
        Add another client
      </Button>

      {count > 0 && (
        <Callout tone={floorCents && gap < 0 ? "warn" : "ok"} role="status" title={`${count} client${count === 1 ? "" : "s"} bring in ${formatCents(monthlyCents)}/mo`}>
          {floorCents > 0 &&
            (gap >= 0
              ? `${formatCents(gap)} above your ${formatCents(floorCents)} floor.`
              : `${formatCents(-gap)} short of your ${formatCents(floorCents)} floor.`)}
        </Callout>
      )}

      {(formError || skip.error) && <Callout tone="bad" role="alert" title={formError ?? skip.error ?? ""} />}
      <FormActions
        submitLabel="Save and continue"
        pending={pending}
        back={<BackButton href={pathForStep(2)} />}
        secondary={
          <Button variant="subtle" color="ink" size="md" loading={skip.pending} onClick={() => skip.run()}>
            Skip for now
          </Button>
        }
      />
    </form>
  );
}
