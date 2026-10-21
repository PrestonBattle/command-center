"use client";

import { ActionIcon, Button, Modal } from "@mantine/core";
import { IconHelpCircle } from "@tabler/icons-react";
import { useCountUp } from "@/global/hooks/use-count-up";
import { formatDollars as money } from "@/global/lib/money";
import { explainerSteps } from "./explainer-steps";
import { useExplainer } from "./use-explainer";
import { WaterLineTank } from "./water-tank";
import { WATERLINE_STATES } from "./waterline-state";

type Props = {
  /** Monthly floor in dollars (0 if not set yet). */
  floor: number;
  /** This month's revenue / floor. */
  coverage: number;
};

/**
 * The "?" on the Snapshot. Opens a short walkthrough: the tank fills to
 * each state using the person's own floor, the figure counts to that
 * state's number, and a line explains it; the last step is where they
 * really are. Stepped by hand (no auto-advance), and with reduced motion
 * the tank and figure change without animating.
 */
export function SnapshotExplainer({ floor, coverage }: Props) {
  const steps = explainerSteps(floor, coverage);
  const tour = useExplainer(steps);
  const figure = useCountUp(tour.opened ? tour.step.gapDollars : 0, 900);
  const state = tour.step.state ? WATERLINE_STATES[tour.step.state] : null;
  const last = tour.index === tour.count - 1;

  return (
    <>
      <ActionIcon variant="subtle" color="ink" size="sm" aria-label="How the Snapshot works" aria-haspopup="dialog" onClick={tour.open}>
        <IconHelpCircle size={18} stroke={1.8} aria-hidden />
      </ActionIcon>
      <Modal
        opened={tour.opened}
        onClose={tour.close}
        title="How your Snapshot works"
        centered
        size="lg"
        transitionProps={{ onEntered: tour.startFill }}
      >
        <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-6">
          <div className="h-72">
            <WaterLineTank coverage={tour.tankLevel} durationClass="duration-1000" />
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex h-7 items-center">
              {state && <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${state.chip}`}>{state.label}</span>}
            </div>
            {/* Decorative count: the step text below states the real number. */}
            <p aria-hidden className={`font-display text-4xl font-bold leading-none tabular-nums ${state?.figure ?? ""}`}>
              {money(figure)} <span className="text-2xl">{tour.step.short ? "short" : "clear"}</span>
            </p>
            {/* Announced on each step, so screen-reader users follow along. */}
            <div aria-live="polite" className="flex flex-col gap-2">
              <h3 className="text-lg font-bold">{tour.step.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {tour.step.body}{" "}
                <span className="sr-only">
                  {`${money(tour.step.gapDollars)} ${tour.step.short ? "short of" : "clear of"} the floor.`}
                </span>
              </p>
            </div>
          </div>
        </div>

        <ol className="mt-6 flex flex-wrap gap-1.5" aria-label="Steps">
          {steps.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => tour.goTo(i)}
                aria-current={i === tour.index ? "step" : undefined}
                className={[
                  "min-h-9 rounded-full border px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[var(--accent)] pointer-coarse:min-h-11",
                  i === tour.index
                    ? "border-[var(--accent)] bg-[var(--surface-inset)] text-[var(--text)]"
                    : "border-[var(--divider)] text-[var(--text-muted)] hover:text-[var(--text)]",
                ].join(" ")}
              >
                {s.chip}
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button variant="subtle" color="ink" onClick={tour.back} disabled={tour.index === 0}>
            Back
          </Button>
          <span className="text-sm text-[var(--text-faint)]">
            {tour.index + 1} of {tour.count}
          </span>
          {last ? <Button onClick={tour.close}>Got it</Button> : <Button onClick={tour.next}>Next</Button>}
        </div>
      </Modal>
    </>
  );
}
