import type { HTMLAttributes, ReactNode } from "react";
import Glass from "./glass";

const PADDING = {
  sm: "p-4",
  md: "p-6",
  lg: "p-6 sm:p-10",
} as const;

type GlassPanelProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: string;
  description?: string;
  /** Anything for the header's right side: a button, a total, a badge. */
  actions?: ReactNode;
  padding?: keyof typeof PADDING;
  children: ReactNode;
};

/**
 * A Glass card with consistent padding and an optional header. Extra HTML
 * attributes (aria-live, aria-labelledby, id, …) pass through to the card.
 */
export function GlassPanel({
  title,
  description,
  actions,
  padding = "md",
  className = "",
  children,
  ...rest
}: GlassPanelProps) {
  const hasHeader = title || description || actions;

  return (
    <Glass className={`flex flex-col gap-5 rounded-3xl ${PADDING[padding]} ${className}`} {...rest}>
      {hasHeader && (
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            {title && <h2 className="font-display text-xl font-bold">{title}</h2>}
            {description && <p className="text-sm text-[var(--text-muted)]">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </Glass>
  );
}
