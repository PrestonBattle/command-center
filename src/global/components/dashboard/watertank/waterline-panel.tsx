import { Panel } from "../../panel/panel";
import { WaterLineTank } from "./water-tank";

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
 * Four bands, not a gradient. The floor is a threshold, not a smooth
 * scale -- $10 under and $10 over are different situations, and the
 * state chip should say so rather than easing from amber to teal.
 */
const STATE = {
  under: {
    label: "Underwater",
    chip: "bg-negative/12 text-negative",
    figure: "text-negative",
  },
  treading: {
    label: "Treading water",
    chip: "bg-caution/12 text-caution",
    figure: "text-caution",
  },
  afloat: {
    label: "Afloat",
    chip: "bg-positive/12 text-positive",
    figure: "text-ink",
  },
  clear: {
    label: "Clear",
    chip: "bg-positive/12 text-positive",
    figure: "text-ink",
  },
} as const;

export function WaterLinePanel({
  personal,
  business,
  taxRate,
  revenue,
  topClientName,
  topClientMrr,
  style,
}: WaterLinePanelProps) {
  // Business expenses are deductible, your personal draw isn't — so to keep
  // `personal` after tax the business must earn personal / (1 - rate) on top
  // of covering `business`. Applying the rate to the sum under-reserves.
  const rate = taxRate / 100;
  const floor = business + personal / (1 - rate);

  const gap = floor - revenue;
  const coverage = floor > 0 ? revenue / floor : 0;
  const short = gap > 0;

  const key =
    coverage < 0.9 ? "under"
      : coverage < 1 ? "treading"
        : coverage < 1.15 ? "afloat"
          : "clear";
  const state = STATE[key];

  const dayCost = floor / 30.44;
  const coveredThrough = coverageDate(coverage);
  const topShare = topClientMrr && revenue > 0 ? topClientMrr / revenue : null;

  // Revenue clears the operating costs but not the reserve. The specific
  // way this goes wrong for solo operators: the month feels fine because
  // rent and groceries cleared, then April arrives.
  const taxUncovered = revenue >= personal + business && revenue < floor;

  return (
    <Panel
      plain
      style={style}
      className="grid grid-cols-[14px_minmax(0,1fr)] gap-5"
    >
      <WaterLineTank coverage={coverage} />

      <div>

        <div className="mb-3 flex items-center gap-2 justify-between">
          <p className="mb-3 text-lg font-medium uppercase tracking-wider text-ink-subtle">
            Snapshot
          </p>

        </div>

        <p className={`text-4xl font-medium leading-none ${state.figure}`}>
          {money(Math.abs(gap))}{" "}
          <span className="text-3xl">{short ? "short" : "clear"}</span>
        </p>
        <span className="text-xs text-ink-subtle">Floor · {money(floor)}</span>
        <p className="mt-2 text-sm text-ink-muted">
          Revenue is {money(revenue)} — {Math.round(coverage * 100)}% of what
          you need.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat
            label="A day costs"
            value={money(dayCost)}
            hint="Whether or not you work"
          />
          <Stat
            label="Covered through"
            value={coveredThrough}
            hint="At this month's rate"
          />
          <Stat
            label="Largest client"
            value={topShare ? `${Math.round(topShare * 100)}%` : "—"}
            hint={topShare ? (topClientName ?? "of revenue") : "No clients yet"}
          />
        </div>

        {taxUncovered && (
          <div className="mt-3 rounded-lg bg-caution/10 p-3">
            <p className="text-sm text-ink">
              You&apos;re paying yourself and running the business, but nothing
              is going aside for taxes.
            </p>
          </div>
        )}

        {/* Stays visible even when clear — being above the line because of
            one client is a different situation from being above it across
            five. */}

      </div>
    </Panel>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-lg bg-paper-dim p-3">
      <p className="text-xs text-ink-subtle">{label}</p>
      <p className="mt-0.5 text-lg font-medium tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 truncate text-xs text-ink-subtle">{hint}</p>
    </div>
  );
}

const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

/**
 * Coverage as a date rather than a fraction. "71%" is abstract; "the money
 * runs out on the 22nd" isn't — and unlike the percentage, this one shifts
 * meaning as the month progresses.
 */
function coverageDate(coverage: number): string {
  const now = new Date();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();

  if (coverage >= 1) return "All month";

  const day = Math.max(1, Math.floor(daysInMonth * coverage));
  return new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  );
}