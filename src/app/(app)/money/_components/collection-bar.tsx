import { GlassPanel } from "@/global/components/glass/glass-panel";
import type { scheduleTotals } from "@/global/lib/billing";
import { formatCents } from "@/global/lib/money";

type Props = { totals: ReturnType<typeof scheduleTotals>; floorCents: number };

/** Collected vs expected for the month as a bar, with a written legend (not color alone). */
export function CollectionBar({ totals, floorCents }: Props) {
  const { expectedCents, paidCents, overdueCents, remainingCents } = totals;
  const pct = (cents: number) => (expectedCents ? (cents / expectedCents) * 100 : 0);
  const floorNote =
    floorCents === 0
      ? "Set your floor on Life vest to compare against it."
      : paidCents >= floorCents
        ? `Your ${formatCents(floorCents)} floor is covered.`
        : `${formatCents(floorCents - paidCents)} more to reach your ${formatCents(floorCents)} floor.`;

  return (
    <GlassPanel>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--text-muted)]">Collected</p>
          <p className="font-display text-4xl font-bold tabular-nums">
            {formatCents(paidCents)}
            <span className="font-sans text-lg font-medium text-[var(--text-muted)]"> of {formatCents(expectedCents)} expected</span>
          </p>
        </div>
        <p className="text-sm text-[var(--text-muted)]">{floorNote}</p>
      </div>
      <div
        role="img"
        aria-label={`${formatCents(paidCents)} paid, ${formatCents(overdueCents)} overdue, ${formatCents(remainingCents)} still expected`}
        className="flex h-3.5 overflow-hidden rounded-full bg-[var(--surface-inset)] ring-1 ring-[var(--divider)]"
      >
        <div className="bg-[var(--ok)]" style={{ width: `${pct(paidCents)}%` }} />
        <div className="bg-[var(--bad)]" style={{ width: `${pct(overdueCents)}%` }} />
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--text-muted)]">
        <li><span aria-hidden className="mr-1.5 inline-block size-2.5 rounded-sm bg-[var(--ok)]" />Paid {formatCents(paidCents)}</li>
        <li><span aria-hidden className="mr-1.5 inline-block size-2.5 rounded-sm bg-[var(--bad)]" />Overdue {formatCents(overdueCents)}</li>
        <li><span aria-hidden className="mr-1.5 inline-block size-2.5 rounded-sm bg-[var(--surface-inset)] ring-1 ring-[var(--divider)]" />Still expected {formatCents(remainingCents)}</li>
      </ul>
    </GlassPanel>
  );
}
