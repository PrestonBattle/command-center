"use client";

import { useReducedMotion } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";

/**
 * A number that animates to `target` whenever it changes: from wherever it
 * is now, easing out over `durationMs`. With reduced motion it jumps
 * straight to the target. For figures in explainers, not for live data
 * people read precisely (a counting number is briefly wrong on purpose).
 */
export function useCountUp(target: number, durationMs = 700): number {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (reduceMotion || from === target) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - t) ** 3;
      const next = from + (target - from) * eased;
      fromRef.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, reduceMotion]);

  return value;
}
