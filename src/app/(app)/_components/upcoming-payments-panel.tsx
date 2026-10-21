import { ButtonLink } from "@/global/components/button-link";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { EmptyState, StatusBadge } from "@/global/components/layout";
import type { ScheduledPayment } from "@/global/lib/billing";
import { formatShortDate } from "@/global/lib/dates";
import { formatCents } from "@/global/lib/money";
import { PAYMENT_STATUS } from "@/global/lib/payment-status";

const SHOWN = 5;

/** This month's payments in due order, with a link to Money to record them. */
export function UpcomingPaymentsPanel({ rows }: { rows: ScheduledPayment[] }) {
  return (
    <GlassPanel
      title="Payments this month"
      actions={<ButtonLink href="/money" variant="subtle" size="compact-md">Open Money</ButtonLink>}
    >
      {rows.length === 0 ? (
        <EmptyState title="Nothing expected" description="Add services to your clients to see payments here." />
      ) : (
        <ul className="flex flex-col">
          {rows.slice(0, SHOWN).map((r) => {
            const status = PAYMENT_STATUS[r.status];
            return (
              <li key={r.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--divider)] py-3 first:border-t-0">
                <span className="min-w-0 basis-full truncate font-semibold sm:flex-1 sm:basis-auto">{r.clientName}</span>
                <span className="text-sm text-[var(--text-faint)] sm:w-16">{formatShortDate(r.dueOn)}</span>
                <span className="ml-auto font-semibold tabular-nums sm:ml-0 sm:w-20 sm:text-right">{formatCents(r.amountCents)}</span>
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              </li>
            );
          })}
        </ul>
      )}
    </GlassPanel>
  );
}
