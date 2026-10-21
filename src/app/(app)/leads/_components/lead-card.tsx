"use client";

import { useDraggable } from "@dnd-kit/core";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconGripVertical } from "@tabler/icons-react";
import Link from "next/link";
import Glass from "@/global/components/glass/glass";
import { StatusBadge } from "@/global/components/layout";
import { useActionButton } from "@/global/hooks/use-action-button";
import { formatCents } from "@/global/lib/money";
import type { LeadRow, LeadStage } from "@/global/types/supabase/types";
import { convertLead, updateLead } from "../actions";
import { toLeadFormValues } from "../_lib/lead-form-values";
import { LeadFormDialog } from "./lead-form-dialog";
import { LeadMenu } from "./lead-menu";

type Props = { lead: LeadRow; days: number; stale: boolean; onMove: (leadId: string, to: LeadStage) => void };

/**
 * One lead. Drag the card (anywhere but its buttons) to another column, or
 * use the grip with the keyboard, or "Move to" in the "⋯" menu. The name
 * opens Edit. Won leads offer "Make client".
 */
export function LeadCard({ lead, days, stale, onMove }: Props) {
  const convert = useActionButton(convertLead);
  const [editing, { open: edit, close: stopEditing }] = useDisclosure(false);
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: lead.id,
    data: { stage: lead.stage },
  });

  return (
    <li ref={setNodeRef} className={isDragging ? "opacity-40" : undefined}>
      {/* Pointer, touch and key listeners on the whole card; the sensors
          ignore presses that start on a button, link or input, and the
          keyboard only picks up from the grip. */}
      <Glass {...listeners} className="flex cursor-grab flex-col gap-3 rounded-2xl p-4 active:cursor-grabbing">
        <div className="flex items-start gap-1">
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            type="button"
            data-drag-handle
            aria-label={`Move ${lead.name}`}
            className="-ml-2 -mt-1 flex size-8 shrink-0 cursor-grab pointer-coarse:size-11 items-center justify-center rounded-md text-[var(--text-faint)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <IconGripVertical size={16} aria-hidden />
          </button>
          <h3 className="min-w-0 flex-1 break-words font-bold">
            <button
              type="button"
              onClick={edit}
              aria-label={`Edit ${lead.name}`}
              className="rounded text-left hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              {lead.name}
            </button>
          </h3>
          <LeadMenu lead={lead} onEdit={edit} onMove={(to) => onMove(lead.id, to)} />
        </div>
        {lead.estimated_monthly_cents ? (
          <p className="font-display text-xl font-bold tabular-nums">{formatCents(lead.estimated_monthly_cents)}/mo</p>
        ) : null}
        {/* One line each, cut with "…" when a column is narrow: an email
            broken mid-word is harder to read than a shortened one. */}
        {lead.contact_name && <p className="truncate text-sm text-[var(--text-muted)]">{lead.contact_name}</p>}
        {lead.email && <p className="truncate text-sm text-[var(--text-muted)]" title={lead.email}>{lead.email}</p>}
        {/* Stale gets its own line: next to the name it collided with long
            names in narrow columns. Badge word + days, never color alone. */}
        {stale ? (
          <div>
            <StatusBadge tone="warn">{`Stale · ${days}d`}</StatusBadge>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-faint)]">{days === 0 ? "Moved here today" : `In this stage ${days} day${days === 1 ? "" : "s"}`}</p>
        )}
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
