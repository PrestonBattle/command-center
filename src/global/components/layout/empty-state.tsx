import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Usually a button that creates the first item. */
  action?: ReactNode;
};

/** What a list shows when there's nothing in it yet: what goes here and how to add one. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <p className="font-display text-xl font-bold">{title}</p>
      {description && <p className="max-w-sm text-[var(--text-muted)]">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
