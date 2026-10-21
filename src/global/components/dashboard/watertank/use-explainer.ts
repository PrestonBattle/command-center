"use client";

import { useRef, useState } from "react";
import type { ExplainerStep } from "./explainer-steps";

/** If the dialog's open transition never reports in, fill anyway after this. */
const FILL_FALLBACK_MS = 450;

/**
 * The explainer's state: open or not, which step, and the tank level to
 * draw. Opening starts from an empty tank; once the dialog has finished
 * appearing (`startFill`, from its transition) the water rises to the line,
 * so the rise is the first thing you see rather than happening off-screen.
 */
export function useExplainer(steps: ExplainerStep[]) {
  const [opened, setOpened] = useState(false);
  const [index, setIndex] = useState(0);
  const [filled, setFilled] = useState(false);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startFill() {
    if (fallback.current) clearTimeout(fallback.current);
    setFilled(true);
  }

  function open() {
    setIndex(0);
    setFilled(false);
    setOpened(true);
    fallback.current = setTimeout(startFill, FILL_FALLBACK_MS);
  }

  function close() {
    if (fallback.current) clearTimeout(fallback.current);
    setOpened(false);
  }

  const step = steps[index];
  return {
    opened,
    open,
    close,
    startFill,
    step,
    index,
    count: steps.length,
    tankLevel: filled ? step.coverage : 0,
    goTo: setIndex,
    back: () => setIndex((i) => Math.max(0, i - 1)),
    next: () => setIndex((i) => Math.min(steps.length - 1, i + 1)),
  };
}
