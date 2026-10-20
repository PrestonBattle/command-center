import { Button } from "@mantine/core";
import Link from "next/link";
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
      actions={<Button component={Link} href="/money" variant="subtle" size="compact-md">Open Money</Button>}
    >
      {rows.length === 0 ? (
        <EmptyState title="Nothing expected" description="Add services to your clients to see payments here." />
      ) : (
        <ul className="flex flex-col">
          {rows.slice(0, SHOWN).map((r) => {
            const status = PAYMENT_STATUS[r.status];
            return (
              <li key={r.key} className="flex items-center gap-3 border-t border-[var(--divider)] py-3 first:border-t-0">
                <span className="min-w-0 flex-1 truncate font-semibold">{r.clientName}</span>
                <span className="w-16 text-sm text-[var(--text-faint)]">{formatShortDate(r.dueOn)}</span>
                <span className="w-20 text-right font-semibold tabular-nums">{formatCents(r.amountCents)}</span>
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              </li>
            );
          })}
        </ul>
      )}
    </GlassPanel>
  );
}
