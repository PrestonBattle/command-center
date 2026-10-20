import { GlassPanel } from "@/global/components/glass/glass-panel";
import { formatCents } from "@/global/lib/money";
import { coveragePercent } from "../_lib/what-if";

type Props = {
  revenueCents: number;
  floorCents: number;
  revenueIsEstimate: boolean;
  biggestClient: { name: string; monthlyCents: number } | null;
};

/** How much of the floor current revenue covers, as a number, a bar and plain words. */
export function CoveragePanel({ revenueCents, floorCents, revenueIsEstimate, biggestClient }: Props) {
  const pct = coveragePercent(revenueCents, floorCents);
  const gap = revenueCents - floorCents;
  // The bar runs to 150% of the floor so being over still shows headroom.
  const scale = Math.max(floorCents * 1.5, revenueCents, 1);
  const share = biggestClient && revenueCents ? Math.round((biggestClient.monthlyCents / revenueCents) * 100) : 0;

  return (
    <GlassPanel title="If nothing changes" description={revenueIsEstimate ? "Using the revenue estimate from onboarding until you add clients." : undefined}>
      <p className="flex flex-wrap items-baseline gap-x-3">
        <span className="font-display text-6xl font-bold tabular-nums">{floorCents ? `${pct}%` : "—"}</span>
        <span className="text-[var(--text-muted)]">{floorCents ? "of your floor is covered" : "Add your costs below to set a floor"}</span>
      </p>
      {floorCents > 0 && (
        <>
          <div
            role="img"
            aria-label={`Revenue ${formatCents(revenueCents)} against a floor of ${formatCents(floorCents)}`}
            className="relative h-4 rounded-full bg-[var(--surface-inset)] ring-1 ring-[var(--divider)]"
          >
            <div className={`h-full rounded-full ${gap >= 0 ? "bg-[var(--ok)]" : "bg-[var(--warn)]"}`} style={{ width: `${(revenueCents / scale) * 100}%` }} />
            <div aria-hidden className="absolute -inset-y-1.5 border-l-2 border-dashed border-[var(--text)]" style={{ left: `${(floorCents / scale) * 100}%` }} />
          </div>
          <dl className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Monthly revenue", value: formatCents(revenueCents) },
              { label: gap >= 0 ? "Cushion" : "Short by", value: formatCents(Math.abs(gap)) },
              { label: "Biggest client", value: biggestClient ? `${share}%` : "—", hint: biggestClient?.name },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-[var(--surface-inset)] p-4">
                <dt className="text-sm font-semibold text-[var(--text-muted)]">{s.label}</dt>
                <dd className="font-display text-2xl font-bold tabular-nums">{s.value}</dd>
                {s.hint && <dd className="truncate text-xs text-[var(--text-faint)]">{s.hint}</dd>}
              </div>
            ))}
          </dl>
        </>
      )}
    </GlassPanel>
  );
}
