"use client";

import { Button, Select } from "@mantine/core";
import Link from "next/link";
import { ConfirmButton } from "@/global/components/confirm-button";
import Glass from "@/global/components/glass/glass";
import { StatusBadge } from "@/global/components/layout";
import { useActionButton } from "@/global/hooks/use-action-button";
import { formatCents } from "@/global/lib/money";
import type { LeadRow } from "@/global/types/supabase/types";
import { convertLead, deleteLead, moveLead } from "../actions";
import { LEAD_STAGES } from "../_lib/stages";

type Props = { lead: LeadRow; days: number; stale: boolean };

/**
 * One lead. Moving it is a select, not drag-and-drop, so it works by
 * keyboard and screen reader. Won leads offer "Make client".
 */
export function LeadCard({ lead, days, stale }: Props) {
  const move = useActionButton(moveLead);
  const convert = useActionButton(convertLead);

  return (
    <li>
      <Glass className="flex flex-col gap-3 rounded-2xl p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold">{lead.name}</h3>
          {stale && <StatusBadge tone="warn">{`Stale ${days}d`}</StatusBadge>}
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          {lead.converted_client_id ? (
            <Button component={Link} href={`/clients/${lead.converted_client_id}`} variant="light" size="compact-sm">
              View client
            </Button>
          ) : lead.stage === "won" ? (
            <Button size="compact-sm" loading={convert.pending} onClick={() => convert.run(lead.id)}>
              Make client
            </Button>
          ) : (
            <span />
          )}
          <ConfirmButton
            danger
            title={`Delete ${lead.name}?`}
            message="This removes the lead for good."
            confirmLabel="Delete lead"
            action={() => deleteLead(lead.id)}
            buttonProps={{ size: "compact-sm", "aria-label": `Delete ${lead.name}` }}
          >
            Delete
          </ConfirmButton>
        </div>
        {convert.error && <p role="alert" className="text-sm font-semibold text-[var(--bad)]">{convert.error}</p>}
      </Glass>
    </li>
  );
}
