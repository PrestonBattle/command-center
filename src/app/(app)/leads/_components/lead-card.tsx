"use client";

import { Button, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import Glass from "@/global/components/glass/glass";
import { StatusBadge } from "@/global/components/layout";
import { useActionButton } from "@/global/hooks/use-action-button";
import { LEAD_STAGES } from "@/global/lib/lead-stages";
import { formatCents } from "@/global/lib/money";
import type { LeadRow } from "@/global/types/supabase/types";
import { convertLead, moveLead, updateLead } from "../actions";
import { toLeadFormValues } from "../_lib/lead-form-values";
import { LeadFormDialog } from "./lead-form-dialog";
import { LeadMenu } from "./lead-menu";

type Props = { lead: LeadRow; days: number; stale: boolean };

/**
 * One lead. Its name opens Edit; the "⋯" menu has Edit and Delete. Moving
 * is a select so it works by keyboard and screen reader. Won leads offer
 * "Make client".
 */
export function LeadCard({ lead, days, stale }: Props) {
  const move = useActionButton(moveLead);
  const convert = useActionButton(convertLead);
  const [editing, { open: edit, close: stopEditing }] = useDisclosure(false);

  return (
    <li>
      <Glass className="flex flex-col gap-3 rounded-2xl p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 font-bold">
            <button
              type="button"
              onClick={edit}
              aria-label={`Edit ${lead.name}`}
              className="rounded text-left hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              {lead.name}
            </button>
          </h3>
          <div className="flex shrink-0 items-center gap-1">
            {stale && <StatusBadge tone="warn">{`Stale ${days}d`}</StatusBadge>}
            <LeadMenu lead={lead} onEdit={edit} />
          </div>
        </div>
        {lead.estimated_monthly_cents ? (
          <p className="font-display text-xl font-bold tabular-nums">{formatCents(lead.estimated_monthly_cents)}/mo</p>
        ) : null}
        {(lead.contact_name || lead.email) && (
          <p className="text-sm text-[var(--text-muted)]">{[lead.contact_name, lead.email].filter(Boolean).join(" · ")}</p>
        )}
        <p className="text-xs text-[var(--text-faint)]">{days === 0 ? "Moved here today" : `In this stage ${days} day${days === 1 ? "" : "s"}`}</p>

        <Select
          aria-label={`Stage for ${lead.name}`}
          size="sm"
          data={LEAD_STAGES}
          defaultValue={lead.stage}
          allowDeselect={false}
          disabled={move.pending}
          error={move.error}
          onChange={(stage) => stage && move.run({ leadId: lead.id, stage })}
        />
        {lead.converted_client_id ? (
          <Button component={Link} href={`/clients/${lead.converted_client_id}`} variant="light" size="compact-sm" className="self-start">
            View client
          </Button>
        ) : lead.stage === "won" ? (
          <Button size="compact-sm" loading={convert.pending} onClick={() => convert.run(lead.id)} className="self-start">
            Make client
          </Button>
        ) : null}
        {convert.error && <p role="alert" className="text-sm font-semibold text-[var(--bad)]">{convert.error}</p>}
      </Glass>
      <LeadFormDialog
        opened={editing}
        onClose={stopEditing}
        title={`Edit ${lead.name}`}
        initialValues={toLeadFormValues(lead)}
        action={(values) => updateLead({ ...values, leadId: lead.id })}
        submitLabel="Save changes"
      />
    </li>
  );
}
