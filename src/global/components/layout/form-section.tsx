import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  /** Right side of the heading, e.g. a running total like "$2,700/mo". */
  aside?: ReactNode;
  children: ReactNode;
};

/** A titled group of fields inside a form, with an optional value on the right. */
export function FormSection({ title, aside, children }: FormSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-bold">{title}</h2>
        {aside && <span className="text-sm tabular-nums text-[var(--text-muted)]">{aside}</span>}
      </div>
      {children}
    </section>
  );
}
