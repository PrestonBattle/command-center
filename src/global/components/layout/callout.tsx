import type { ReactNode } from "react";

const TONES = {
  ok: "bg-[var(--ok)]/10 text-[var(--ok)]",
  warn: "bg-[var(--warn)]/10 text-[var(--warn)]",
  bad: "bg-[var(--bad)]/10 text-[var(--bad)]",
  info: "bg-[var(--surface-inset)] text-[var(--text)]",
} as const;

type CalloutProps = {
  tone?: keyof typeof TONES;
  title?: string;
  /** Use "alert" for messages that appear after an action, e.g. a form error. */
  role?: "alert" | "status";
  children?: ReactNode;
};

/** A tinted message box. Tone carries meaning, so the text always says it too. */
export function Callout({ tone = "info", title, role, children }: CalloutProps) {
  return (
    <div role={role} className={`flex flex-col gap-1 rounded-2xl px-4 py-3 text-sm ${TONES[tone]}`}>
      {title && <p className="font-bold">{title}</p>}
      {children && <div className="text-[var(--text)]">{children}</div>}
    </div>
  );
}
