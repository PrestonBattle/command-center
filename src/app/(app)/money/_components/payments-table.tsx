import Link from "next/link";
import { ButtonLink } from "@/global/components/button-link";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { EmptyState, StatusBadge } from "@/global/components/layout";
import type { ScheduledPayment } from "@/global/lib/billing";
import { formatShortDate } from "@/global/lib/dates";
import { formatCents } from "@/global/lib/money";
import { PAYMENT_STATUS } from "@/global/lib/payment-status";
import { PaymentAction } from "./payment-action";

type Props = {
  title: string;
  rows: ScheduledPayment[];
  emptyText?: string;
  /** Show only the first this-many rows, with a link to the rest. */
  limit?: number;
  /** Where "Show all" goes (the same month with ?all=1). */
  showAllHref?: string;
};

/**
 * A table of scheduled payments with status and a mark-paid button per row.
 * Below `sm` the Due, Service and Status columns fold into the Client and
 * Amount cells, so the table fits a phone without sideways scrolling --
 * a swipe-to-see-who-paid table is easy to misread.
 */
export function PaymentsTable({ title, rows, emptyText, limit, showAllHref }: Props) {
  // A business with hundreds of clients has hundreds of rows a month; the
  // first ones (soonest due) are what you act on, the rest are a click away.
  const shown = limit ? rows.slice(0, limit) : rows;
  return (
    <GlassPanel title={title}>
      {rows.length === 0 ? (
        <EmptyState title={emptyText ?? "Nothing expected"} description="Payments come from each client's services." />
      ) : (
        <div className="-mx-2 overflow-x-auto px-2">
          <table className="w-full text-sm sm:min-w-[640px]">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="text-left text-[var(--text-muted)]">
                <th scope="col" className="hidden pb-2 font-semibold sm:table-cell">Due</th>
                <th scope="col" className="pb-2 font-semibold">Client</th>
                <th scope="col" className="hidden pb-2 font-semibold sm:table-cell">Service</th>
                <th scope="col" className="pb-2 text-right font-semibold">Amount</th>
                <th scope="col" className="hidden pb-2 pl-4 font-semibold sm:table-cell">Status</th>
                <th scope="col" className="pb-2"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const status = PAYMENT_STATUS[r.status];
                const badge = (
                  <StatusBadge tone={status.tone}>{r.paidOn ? `Paid ${formatShortDate(r.paidOn)}` : status.label}</StatusBadge>
                );
                return (
                  <tr key={r.key} className="border-t border-[var(--divider)]">
                    <td className="hidden py-3 text-[var(--text-muted)] sm:table-cell">{formatShortDate(r.dueOn)}</td>
                    <td className="py-3 font-semibold">
                      <Link href={`/clients/${r.clientId}`} className="hover:underline">{r.clientName}</Link>
                      <p className="text-xs font-normal text-[var(--text-muted)] sm:hidden">
                        {formatShortDate(r.dueOn)} · {r.serviceName}
                      </p>
                    </td>
                    <td className="hidden py-3 text-[var(--text-muted)] sm:table-cell">{r.serviceName}</td>
                    <td className="py-3 text-right font-semibold tabular-nums">
                      {formatCents(r.amountCents)}
                      <div className="mt-1 sm:hidden">{badge}</div>
                    </td>
                    <td className="hidden py-3 pl-4 sm:table-cell">{badge}</td>
                    <td className="py-3 pl-2 text-right"><PaymentAction row={r} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {shown.length < rows.length && showAllHref && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--divider)] pt-3 text-sm text-[var(--text-muted)]">
          <span>
            Showing {shown.length} of {rows.length}
          </span>
          <ButtonLink href={showAllHref} variant="subtle" color="ink" size="compact-md">
            Show all {rows.length}
          </ButtonLink>
        </div>
      )}
    </GlassPanel>
  );
}
