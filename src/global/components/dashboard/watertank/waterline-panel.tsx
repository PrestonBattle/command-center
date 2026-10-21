import Glass from "@/global/components/glass/glass";
import { calculateFloorCents } from "@/global/lib/floor";
import { formatDollars as money } from "@/global/lib/money";
import { InsetStat } from "./inset-stat";
import { WaterLineTank } from "./water-tank";
import { coverageDate, waterlineState, WATERLINE_STATES } from "./waterline-state";

type WaterLinePanelProps = {
  /** Monthly personal expenses — rent, food, car, savings. */
  personal: number;
  /** Monthly business costs — software, contractors, ads. */
  business: number;
  /** Combined self-employment + income tax, as a percent. 28 not 0.28. */
  taxRate: number;
  /** Monthly recurring revenue, normalized. */
  revenue: number;
  topClientName?: string;
  topClientMrr?: number;
  style?: React.CSSProperties;
};

/**
 * The dashboard's headline: how far revenue is above or below the floor,
 * shown as a water line, a state word, and three plain-language figures.
 */
export function WaterLinePanel({
  personal,
  business,
  taxRate,
  revenue,
  topClientName,
  topClientMrr,
  style,
}: WaterLinePanelProps) {
  // The floor formula lives in one place (global/lib/floor.ts); this panel
  // works in dollars, so convert in and out.
  const floor =
    calculateFloorCents({ personalCents: personal * 100, businessCents: business * 100, taxRate: taxRate / 100 }) / 100;

  const gap = floor - revenue;
  const coverage = floor > 0 ? revenue / floor : 0;
  const state = WATERLINE_STATES[waterlineState(coverage)];
  const topShare = topClientMrr && revenue > 0 ? topClientMrr / revenue : null;

  // Revenue clears the operating costs but not the reserve. The specific
  // way this goes wrong for solo operators: the month feels fine because
  // rent and groceries cleared, then April arrives.
  const taxUncovered = revenue >= personal + business && revenue < floor;

  return (
    <Glass style={style} className="grid grid-cols-[14px_minmax(0,1fr)] gap-5 rounded-3xl p-6">
      <WaterLineTank coverage={coverage} />

      <div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Snapshot</h2>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${state.chip}`}>{state.label}</span>
        </div>

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
          <InsetStat label="A day costs" value={money(floor / 30.44)} hint="Whether or not you work" />
          <InsetStat label="Covered through" value={coverageDate(coverage)} hint="At this month's rate" />
          <InsetStat
            label="Largest client"
            value={topShare ? `${Math.round(topShare * 100)}%` : "—"}
            hint={topShare ? (topClientName ?? "of revenue") : "No clients yet"}
          />
        </div>

        {taxUncovered && (
          <p className="mt-3 rounded-lg bg-[var(--warn)]/10 p-3 text-sm text-[var(--text)]">
            You&apos;re paying yourself and running the business, but nothing is going aside for taxes.
          </p>
        )}
      </div>
    </Glass>
  );
}
