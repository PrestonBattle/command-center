import Link from "next/link";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { EmptyState, StatusBadge } from "@/global/components/layout";
import type { ScheduledPayment } from "@/global/lib/billing";
import { formatShortDate } from "@/global/lib/dates";
import { formatCents } from "@/global/lib/money";
import { PAYMENT_STATUS } from "@/global/lib/payment-status";
import { PaymentAction } from "./payment-action";

type Props = { title: string; rows: ScheduledPayment[]; emptyText?: string };

/** A table of scheduled payments with status and a mark-paid button per row. */
export function PaymentsTable({ title, rows, emptyText }: Props) {
  return (
    <GlassPanel title={title}>
      {rows.length === 0 ? (
        <EmptyState title={emptyText ?? "Nothing expected"} description="Payments come from each client's services." />
      ) : (
        <div className="-mx-2 overflow-x-auto px-2">
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="text-left text-[var(--text-muted)]">
                <th scope="col" className="pb-2 font-semibold">Due</th>
                <th scope="col" className="pb-2 font-semibold">Client</th>
                <th scope="col" className="pb-2 font-semibold">Service</th>
                <th scope="col" className="pb-2 text-right font-semibold">Amount</th>
                <th scope="col" className="pb-2 pl-4 font-semibold">Status</th>
                <th scope="col" className="pb-2"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const status = PAYMENT_STATUS[r.status];
                return (
                  <tr key={r.key} className="border-t border-[var(--divider)]">
                    <td className="py-3 text-[var(--text-muted)]">{formatShortDate(r.dueOn)}</td>
                    <td className="py-3 font-semibold">
                      <Link href={`/clients/${r.clientId}`} className="hover:underline">{r.clientName}</Link>
                    </td>
                    <td className="py-3 text-[var(--text-muted)]">{r.serviceName}</td>
                    <td className="py-3 text-right font-semibold tabular-nums">{formatCents(r.amountCents)}</td>
                    <td className="py-3 pl-4">
                      <StatusBadge tone={status.tone}>{r.paidOn ? `Paid ${formatShortDate(r.paidOn)}` : status.label}</StatusBadge>
                    </td>
                    <td className="py-3 text-right"><PaymentAction row={r} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </GlassPanel>
  );
}
