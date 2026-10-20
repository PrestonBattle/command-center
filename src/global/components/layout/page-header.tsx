import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  /** Right side: usually the page's main button. */
  actions?: ReactNode;
};

/** The one `<h1>` on a page, an optional supporting line, and optional actions. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
        {description && <p className="text-[var(--text-muted)]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
