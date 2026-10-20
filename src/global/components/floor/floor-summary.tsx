import { GlassPanel } from "@/global/components/glass/glass-panel";
import type { FloorBreakdown } from "@/global/lib/floor";
import { formatCents } from "@/global/lib/money";

type FloorSummaryProps = {
  breakdown: FloorBreakdown;
  /** Tax set-aside as typed, e.g. 28. */
  taxPercent: number;
};

const DAYS_PER_MONTH = 30.4;

/**
 * The floor and how it's made up. aria-live so screen-reader users hear the
 * new total as they type, without moving focus.
 */
export function FloorSummary({ breakdown, taxPercent }: FloorSummaryProps) {
  const rows = [
    { label: "Personal", cents: breakdown.personalCents },
    { label: `Taxes on that (${taxPercent}%)`, cents: breakdown.taxCents },
    { label: "Business", cents: breakdown.businessCents },
  ];

  return (
    <GlassPanel className="lg:sticky lg:top-6" aria-live="polite">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-[var(--text-muted)]">Your floor</h2>
        <p className="font-display text-5xl font-bold tabular-nums">
          {formatCents(breakdown.floorCents)}
          <span className="font-sans text-base font-medium text-[var(--text-muted)]"> /mo</span>
        </p>
        <p className="text-sm text-[var(--text-muted)]">What the business needs to bring in each month to cover life, the business and taxes.</p>
      </div>
      <dl className="flex flex-col gap-2 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4">
            <dt className="text-[var(--text-muted)]">{r.label}</dt>
            <dd className="tabular-nums">{formatCents(r.cents)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-[var(--divider)] pt-2 font-bold">
          <dt>Floor</dt>
          <dd className="tabular-nums">{formatCents(breakdown.floorCents)}</dd>
        </div>
      </dl>
      <p className="rounded-2xl bg-[var(--surface-inset)] p-4 text-sm">
        That&apos;s about <strong>{formatCents(Math.round(breakdown.floorCents / DAYS_PER_MONTH))} a day</strong>, whether or not you work.
      </p>
    </GlassPanel>
  );
}
