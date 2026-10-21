import Glass from "@/global/components/glass/glass";
import { calculateFloorCents } from "@/global/lib/floor";
import { SnapshotEmpty } from "./snapshot-empty";
import { SnapshotExplainer } from "./snapshot-explainer";
import { SnapshotFigures } from "./snapshot-figures";
import { WaterLineTank } from "./water-tank";
import { WATERLINE_STATES, waterlineState } from "./waterline-state";

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
  className?: string;
};

/**
 * The dashboard's headline: how far revenue is above or below the floor,
 * shown as a water line, a state word, and three plain-language figures.
 * With no floor set there's nothing to measure against, so it shows how to
 * set one instead of a misleading "0% of what you need".
 */
export function WaterLinePanel({ personal, business, taxRate, revenue, topClientName, topClientMrr, className = "" }: WaterLinePanelProps) {
  // The floor formula lives in one place (global/lib/floor.ts); this panel
  // works in dollars, so convert in and out.
  const floor =
    calculateFloorCents({ personalCents: personal * 100, businessCents: business * 100, taxRate: taxRate / 100 }) / 100;
  const hasFloor = floor > 0;
  const coverage = hasFloor ? revenue / floor : 0;
  const state = WATERLINE_STATES[waterlineState(coverage)];
  const topShare = topClientMrr && revenue > 0 ? topClientMrr / revenue : null;

  // Revenue clears the operating costs but not the reserve. The specific
  // way this goes wrong for solo operators: the month feels fine because
  // rent and groceries cleared, then April arrives.
  const taxUncovered = revenue >= personal + business && revenue < floor;

  return (
    <Glass className={`grid grid-cols-[14px_minmax(0,1fr)] gap-5 rounded-3xl p-6 ${className}`}>
      <WaterLineTank coverage={coverage} />

      <div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Snapshot</h2>
            <SnapshotExplainer floor={floor} coverage={coverage} />
          </div>
          {hasFloor && <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${state.chip}`}>{state.label}</span>}
        </div>

        {hasFloor ? (
          <SnapshotFigures
            floor={floor}
            revenue={revenue}
            coverage={coverage}
            taxUncovered={taxUncovered}
            topShare={topShare}
            topClientName={topClientName}
          />
        ) : (
          <SnapshotEmpty />
        )}
      </div>
    </Glass>
  );
}
