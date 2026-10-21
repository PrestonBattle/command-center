type InsetStatProps = {
  label: string;
  value: string;
  hint: string;
};

/**
 * A small figure set into a panel. Not the shared `Stat`: that one is its own
 * glass tile, and glass inside glass blurs twice and looks muddy.
 */
export function InsetStat({ label, value, hint }: InsetStatProps) {
  return (
    <div className="rounded-lg bg-[var(--surface-inset)] p-3">
      <p className="text-xs text-[var(--text-faint)]">{label}</p>
      <p className="mt-0.5 text-lg font-medium tabular-nums text-[var(--text)]">{value}</p>
      <p className="mt-0.5 text-xs text-[var(--text-faint)]">{hint}</p>
    </div>
  );
}
