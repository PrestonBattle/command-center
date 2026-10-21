import { formatDollars as money } from "@/global/lib/money";
import { InsetStat } from "./inset-stat";
import { coverageDate, WATERLINE_STATES, waterlineState } from "./waterline-state";
import { WATERLINE_TIPS } from "./waterline-tips";

type Props = {
  floor: number;
  revenue: number;
  /** revenue / floor. */
  coverage: number;
  /** Revenue covers costs but not the tax set-aside. */
  taxUncovered: boolean;
  topShare: number | null;
  topClientName?: string;
};

/** The Snapshot's numbers once a floor is set: the gap, the floor, and three plain-language figures. */
export function SnapshotFigures({ floor, revenue, coverage, taxUncovered, topShare, topClientName }: Props) {
  const gap = floor - revenue;
  const state = WATERLINE_STATES[waterlineState(coverage)];

  return (
    <>
      <p className={`font-display text-4xl font-bold leading-none tabular-nums ${state.figure}`}>
        {money(Math.abs(gap))} <span className="text-3xl">{gap > 0 ? "short" : "clear"}</span>
      </p>
      <span className="text-xs text-[var(--text-faint)]">Floor · {money(floor)}</span>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Revenue is {money(revenue)} — {Math.round(coverage * 100)}% of what you need.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {/* 30.44 = average days per month, so a day's cost doesn't jump
            between February and March. */}
        <InsetStat label="A day costs" value={money(floor / 30.44)} hint="Whether or not you work" info={WATERLINE_TIPS.dayCost} />
        <InsetStat label="Covered through" value={coverageDate(coverage)} hint="At this month's rate" info={WATERLINE_TIPS.coveredThrough} />
        <InsetStat
          label="Largest client"
          info={WATERLINE_TIPS.largestClient}
          value={topShare ? `${Math.round(topShare * 100)}%` : "—"}
          hint={topShare ? (topClientName ?? "of revenue") : "No clients yet"}
        />
      </div>

      {taxUncovered && (
        <p className="mt-3 rounded-lg bg-[var(--warn)]/10 p-3 text-sm text-[var(--text)]">
          You&apos;re paying yourself and running the business, but nothing is going aside for taxes.
        </p>
      )}
    </>
  );
}
