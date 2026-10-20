"use client";

import { IconCheck } from "@tabler/icons-react";

export type StepperProps = {
  labels: string[];
  /** Index of the step being shown (0-based). */
  current: number;
  /** Furthest step reached (0-based). Steps up to it are done and clickable. */
  highest: number;
  onStepClick: (index: number) => void;
};

const DOT = {
  done: "bg-[var(--accent)] text-white border-[var(--accent)]",
  active: "bg-white/70 text-[var(--accent)] border-[var(--accent)]",
  todo: "bg-white/30 text-[var(--text-faint)] border-[var(--divider)]",
} as const;

/**
 * A row of numbered steps. Finished steps are buttons you can go back to;
 * the current and future steps aren't. Phones show "Step 2 of 4 · Your
 * floor" under the dots, since the labels don't fit.
 */
export function Stepper({ labels, current, highest, onStepClick }: StepperProps) {
  return (
    <div className="flex flex-col gap-2">
      <ol className="flex items-start">
        {labels.map((label, i) => {
          const state = i === current ? "active" : i < highest ? "done" : "todo";
          const clickable = i <= highest && i !== current;
          return (
            <li key={label} className="flex flex-1 items-start last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  disabled={!clickable}
                  aria-current={i === current ? "step" : undefined}
                  aria-label={`Step ${i + 1}: ${label}${state === "done" ? " (done)" : ""}`}
                  className={[
                    "flex size-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
                    "disabled:cursor-default enabled:hover:scale-105",
                    DOT[state],
                  ].join(" ")}
                >
                  {state === "done" ? <IconCheck size={16} stroke={3} aria-hidden /> : i + 1}
                </button>
                <span
                  className={`hidden whitespace-nowrap text-xs font-semibold sm:block ${
                    state === "todo" ? "text-[var(--text-faint)]" : "text-[var(--text)]"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < labels.length - 1 && (
                <span
                  aria-hidden
                  className={`mx-2 mt-[18px] h-0.5 flex-1 rounded ${
                    i < highest ? "bg-[var(--accent)]" : "bg-[var(--divider)]"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="text-sm font-semibold sm:hidden">
        Step {current + 1} of {labels.length} · {labels[current]}
      </p>
    </div>
  );
}
