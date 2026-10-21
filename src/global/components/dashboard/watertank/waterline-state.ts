/**
 * Four bands, not a gradient. The floor is a threshold, not a smooth
 * scale -- $10 under and $10 over are different situations, and the
 * state chip should say so rather than easing from amber to teal.
 */
export const WATERLINE_STATES = {
  under: {
    label: "Underwater",
    chip: "bg-[var(--bad)]/12 text-[var(--bad)]",
    figure: "text-[var(--bad)]",
  },
  treading: {
    label: "Treading water",
    chip: "bg-[var(--warn)]/12 text-[var(--warn)]",
    figure: "text-[var(--warn)]",
  },
  afloat: {
    label: "Afloat",
    chip: "bg-[var(--ok)]/12 text-[var(--ok)]",
    figure: "text-[var(--text)]",
  },
  clear: {
    label: "Clear",
    chip: "bg-[var(--ok)]/12 text-[var(--ok)]",
    figure: "text-[var(--text)]",
  },
} as const;

export type WaterlineStateKey = keyof typeof WATERLINE_STATES;

/**
 * Where each band starts, as coverage (revenue / floor). Under 0.9 is
 * underwater. Shared by the panel and its explainer so they can't disagree.
 */
export const WATERLINE_BREAKS = { treading: 0.9, afloat: 1, clear: 1.15 } as const;

/** Which band a coverage ratio (revenue / floor) falls in. */
export function waterlineState(coverage: number): WaterlineStateKey {
  if (coverage < WATERLINE_BREAKS.treading) return "under";
  if (coverage < WATERLINE_BREAKS.afloat) return "treading";
  if (coverage < WATERLINE_BREAKS.clear) return "afloat";
  return "clear";
}

/**
 * Coverage as a date rather than a fraction. "71%" is abstract; "the money
 * runs out on the 22nd" isn't -- and unlike the percentage, this one shifts
 * meaning as the month progresses. `now` is a parameter so tests can pin it.
 */
export function coverageDate(coverage: number, now: Date = new Date()): string {
  if (coverage >= 1) return "All month";

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const day = Math.max(1, Math.floor(daysInMonth * coverage));
  return new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
