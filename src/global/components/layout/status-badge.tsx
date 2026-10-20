const TONES = {
  ok: "bg-[var(--ok)]/12 text-[var(--ok)]",
  warn: "bg-[var(--warn)]/12 text-[var(--warn)]",
  bad: "bg-[var(--bad)]/12 text-[var(--bad)]",
  neutral: "bg-[var(--surface-inset)] text-[var(--text-muted)]",
} as const;

export type BadgeTone = keyof typeof TONES;

/** A small pill with a word in it. The word carries the meaning; color backs it up. */
export function StatusBadge({ tone, children }: { tone: BadgeTone; children: string }) {
  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-bold ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
