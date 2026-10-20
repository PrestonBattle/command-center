"use client";

import { Fragment, useMemo } from "react";
import { IconCheck } from "@tabler/icons-react";

export interface StepperProps {
  labels: string[];
  current: number;
  highest: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
  /** Max steps visible on mobile before scrolling window kicks in */
  mobileVisible?: number;
}

function getVisibleWindow(
  total: number,
  current: number,
  windowSize: number
): { start: number; end: number } {
  if (total <= windowSize) return { start: 0, end: total };
  let start = current - Math.floor(windowSize / 2);
  start = Math.max(0, Math.min(start, total - windowSize));
  return { start, end: start + windowSize };
}

export function Stepper({
  labels,
  current,
  highest,
  completedSteps,
  onStepClick,
  mobileVisible = 4,
}: StepperProps) {
  const window = useMemo(
    () => getVisibleWindow(labels.length, current, mobileVisible),
    [labels.length, current, mobileVisible]
  );

  return (
    <div className="flex items-start overflow-hidden">
      {labels.map((label, i) => {
        const isCompleted = completedSteps.has(i);
        const isActive = i === current;
        const isClickable = i <= highest && i !== current;
        const inWindow = i >= window.start && i < window.end;

        return (
          <Fragment key={i}>
            <div
              className={[
                "flex flex-col items-center gap-1.5 shrink-0",
                inWindow ? "" : "hidden sm:flex",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => isClickable && onStepClick(i)}
                disabled={!isClickable}
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                  "transition-all duration-200 outline-none",
                  isClickable ? "cursor-pointer" : "cursor-default",
                ].join(" ")}
                style={{
                  background: isCompleted
                    ? "var(--mantine-color-blue-6)"
                    : isActive
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(255,255,255,0.06)",
                  border: isActive
                    ? "1.5px solid rgba(255,255,255,0.5)"
                    : isCompleted
                    ? "1.5px solid var(--mantine-color-blue-5)"
                    : "1.5px solid rgba(255,255,255,0.12)",
                  color:
                    isActive || isCompleted ? "white" : "rgba(255,255,255,0.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {isCompleted ? (
                  <IconCheck size={14} strokeWidth={2.5} />
                ) : (
                  i + 1
                )}
              </button>
              <span
                className="text-xs font-medium tracking-wide hidden sm:block"
                style={{
                  color: isActive
                    ? "rgba(255,255,255,0.9)"
                    : isCompleted
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.25)",
                }}
              >
                {label}
              </span>
            </div>

            {i < labels.length - 1 && (
              <div
                className={[
                  "flex-1 h-px mt-4 mx-1",
                  inWindow && i + 1 < window.end ? "" : "hidden sm:block",
                ].join(" ")}
                style={{
                  background: isCompleted
                    ? "var(--mantine-color-blue-6)"
                    : "rgba(255,255,255,0.1)",
                  transition: "background 0.3s ease",
                }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
