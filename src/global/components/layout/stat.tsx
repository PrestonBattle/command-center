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
  /** Tighter padding and a smaller number, for a row of secondary figures. */
  compact?: boolean;
};

/** A dashboard tile: a label, a big number and a line of context. */
export function Stat({ label, value, hint, info, children, compact = false }: StatProps) {
  return (
    <GlassPanel padding="sm" className={compact ? "gap-0.5 px-5 py-3.5" : "gap-1 px-5 py-4 sm:gap-1.5 sm:py-5"}>
      <p className="flex items-center gap-1 text-sm font-semibold text-[var(--text-muted)]">
        {label}
        {info && <InfoTip label={label}>{info}</InfoTip>}
      </p>
      <p className={`font-display font-bold tabular-nums ${compact ? "text-2xl" : "text-2xl sm:text-3xl"}`}>{value}</p>
      {hint && <p className="text-sm text-[var(--text-faint)]">{hint}</p>}
      {children}
    </GlassPanel>
  );
}
