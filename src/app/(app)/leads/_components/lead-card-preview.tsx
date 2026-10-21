import Glass from "@/global/components/glass/glass";
import { formatCents } from "@/global/lib/money";
import type { LeadRow } from "@/global/types/supabase/types";

/**
 * The card under the pointer while dragging: just the name and value. A
 * full copy of the card would duplicate its buttons and dialogs. aria-hidden
 * because the drag announcements already say what's moving.
 */
export function LeadCardPreview({ lead, tilt }: { lead: LeadRow; tilt: boolean }) {
  return (
    <div aria-hidden className={tilt ? "rotate-2" : undefined}>
      <Glass className="flex cursor-grabbing flex-col gap-1 rounded-2xl p-4 shadow-xl">
        <p className="font-bold">{lead.name}</p>
        {lead.estimated_monthly_cents ? (
          <p className="font-display text-lg font-bold tabular-nums">{formatCents(lead.estimated_monthly_cents)}/mo</p>
        ) : null}
      </Glass>
    </div>
  );
}
