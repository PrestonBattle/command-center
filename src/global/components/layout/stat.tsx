import type { ReactNode } from "react";
import { GlassPanel } from "../glass/glass-panel";
import { InfoTip } from "../info-tip";

type StatProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  /** Shows a "?" after the label that explains the number. */
  info?: string;
  /** Extra content under the hint, e.g. a progress bar. */
  children?: ReactNode;
};

/** A dashboard tile: a label, a big number and a line of context. */
export function Stat({ label, value, hint, info, children }: StatProps) {
  return (
    <GlassPanel padding="sm" className="gap-1 px-5 py-4 sm:gap-1.5 sm:py-5">
      <p className="flex items-center gap-1 text-sm font-semibold text-[var(--text-muted)]">
        {label}
        {info && <InfoTip label={label}>{info}</InfoTip>}
      </p>
      <p className="font-display text-2xl font-bold tabular-nums sm:text-3xl">{value}</p>
      {hint && <p className="text-sm text-[var(--text-faint)]">{hint}</p>}
      {children}
    </GlassPanel>
  );
}
