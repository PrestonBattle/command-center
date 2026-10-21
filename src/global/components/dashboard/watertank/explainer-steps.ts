import { formatDollars as money } from "@/global/lib/money";
import { WATERLINE_BREAKS, WATERLINE_STATES, waterlineState, type WaterlineStateKey } from "./waterline-state";

/** One step of the Snapshot explainer: a tank level and what it means. */
export type ExplainerStep = {
  key: string;
  /** Short name for the step chips: "Underwater", "You". */
  chip: string;
  title: string;
  body: string;
  /** Tank level: revenue / floor. */
  coverage: number;
  /** Which state chip to show; null on the intro step. */
  state: WaterlineStateKey | null;
  /** The big figure: how far from the floor, in dollars. */
  gapDollars: number;
  /** "short" below the floor, "clear" at or above it. */
  short: boolean;
};

/** Used when no floor is set yet, so the walkthrough still has numbers. */
export const EXAMPLE_FLOOR = 5000;

const pct = (n: number) => `${Math.round(n * 100)}%`;

/**
 * The explainer's steps, built from the person's own floor so the numbers
 * are theirs: an intro to the line, one step per state at a level inside
 * that state, then where they actually are. Pure, so it can be tested.
 */
export function explainerSteps(floor: number, coverage: number): ExplainerStep[] {
  const hasFloor = floor > 0;
  const f = hasFloor ? floor : EXAMPLE_FLOOR;
  const { treading, afloat, clear } = WATERLINE_BREAKS;

  const at = (c: number) => ({ coverage: c, gapDollars: Math.round(Math.abs(f - f * c)), short: c < 1 });
  const example = (key: WaterlineStateKey, c: number, body: string): ExplainerStep => ({
    key,
    chip: WATERLINE_STATES[key].label,
    title: `${WATERLINE_STATES[key].label}: revenue ${money(f * c)}`,
    body,
    state: key,
    ...at(c),
  });

  const you: ExplainerStep = hasFloor
    ? {
        key: "you",
        chip: "You",
        title: `You're ${WATERLINE_STATES[waterlineState(coverage)].label.toLowerCase()}`,
        body: `This month your revenue is ${money(f * coverage)}, ${pct(coverage)} of your ${money(f)} floor. The tank on your dashboard shows the same thing at a glance.`,
        state: waterlineState(coverage),
        ...at(coverage),
      }
    : {
        key: "you",
        chip: "You",
        title: "Set your floor to see yours",
        body: "These steps used an example floor of $5,000. Add your costs on Life vest and the Snapshot will show where you really are.",
        state: null,
        ...at(0),
      };

  return [
    {
      key: "line",
      chip: "The line",
      title: "The line is your floor",
      body: `Your floor is ${money(f)} a month${hasFloor ? "" : " (an example)"}: what the business has to bring in to cover your life, the business and the taxes on both. The water is this month's revenue. The question is always: is the water above the line?`,
      state: null,
      ...at(1),
    },
    example("under", 0.75, `Under ${pct(treading)} of your floor. Revenue doesn't cover what you need, so the gap comes out of savings or goes on a card. The big number shows how far short you are.`),
    example("treading", 0.95, `Between ${pct(treading)} and ${pct(afloat)}. Close, but still short: one late payment pushes you under. Worth chasing anything overdue.`),
    example("afloat", 1.05, `From ${pct(afloat)} to ${pct(clear)}. Everything is covered, with a thin cushion. Losing one client could put you back under the line.`),
    example("clear", 1.3, `${pct(clear)} and up. Covered with room to spare. The green above the line is money that's free: savings, investing, or a slower month.`),
    you,
  ];
}
