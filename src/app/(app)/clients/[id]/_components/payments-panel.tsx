import { GlassPanel } from "@/global/components/glass/glass-panel";
import { EmptyState } from "@/global/components/layout";
import { formatShortDate } from "@/global/lib/dates";
import { formatCents } from "@/global/lib/money";
import type { PaymentRow } from "@/global/types/supabase/types";

/** Payments received from this client, newest first. Recorded from the Money page. */
export function PaymentsPanel({ payments }: { payments: PaymentRow[] }) {
  const sorted = [...payments].sort((a, b) => (b.paid_on ?? "").localeCompare(a.paid_on ?? ""));
  const total = sorted.reduce((t, p) => t + p.amount_cents, 0);

  return (
    <GlassPanel title="Payments received" description={sorted.length ? `${formatCents(total)} in total` : undefined}>
      {sorted.length === 0 ? (
        <EmptyState title="Nothing recorded yet" description="Mark payments as received on the Money page." />
      ) : (
        <table className="w-full text-sm">
          <caption className="sr-only">Payments received</caption>
          <thead>
            <tr className="text-left text-[var(--text-muted)]">
              <th scope="col" className="pb-2 font-semibold">Paid</th>
              <th scope="col" className="pb-2 font-semibold">Was due</th>
              <th scope="col" className="pb-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id} className="border-t border-[var(--divider)]">
                <td className="py-2">{p.paid_on && formatShortDate(p.paid_on)}</td>
                <td className="py-2 text-[var(--text-muted)]">{formatShortDate(p.due_on)}</td>
                <td className="py-2 text-right font-semibold tabular-nums">{formatCents(p.amount_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </GlassPanel>
  );
}
