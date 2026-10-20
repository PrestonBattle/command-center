import type { ReactNode } from "react";
import { GlassPanel } from "../glass/glass-panel";

type StatProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  /** Extra content under the hint, e.g. a progress bar. */
  children?: ReactNode;
};

/** A dashboard tile: a label, a big number and a line of context. */
export function Stat({ label, value, hint, children }: StatProps) {
  return (
    <GlassPanel padding="sm" className="gap-1.5 px-5 py-5">
      <p className="text-sm font-semibold text-[var(--text-muted)]">{label}</p>
      <p className="font-display text-3xl font-bold tabular-nums">{value}</p>
      {hint && <p className="text-sm text-[var(--text-faint)]">{hint}</p>}
      {children}
    </GlassPanel>
  );
}
