import { InfoTip } from "@/global/components/info-tip";

type InsetStatProps = {
  label: string;
  value: string;
  hint: string;
  /** Shows a "?" after the label that explains the figure. */
  info?: string;
};

/**
 * A small figure set into a panel. Not the shared `Stat`: that one is its own
 * glass tile, and glass inside glass blurs twice and looks muddy.
 */
export function InsetStat({ label, value, hint, info }: InsetStatProps) {
  return (
    <div className="rounded-lg bg-[var(--surface-inset)] p-3">
      <p className="flex items-center gap-1 text-xs text-[var(--text-faint)]">
        {label}
        {info && <InfoTip label={label}>{info}</InfoTip>}
      </p>
      <p className="mt-0.5 text-lg font-medium tabular-nums text-[var(--text)]">{value}</p>
      <p className="mt-0.5 text-xs text-[var(--text-faint)]">{hint}</p>
    </div>
  );
}
