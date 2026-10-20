import type { ReactNode } from "react";
import Glass from "./glass";


const PADDING = {
  sm: "p-4",
  md: "p-6",
  lg: "p-6 sm:p-10",
} as const;

type GlassPanelProps = {
  title?: string;
  description?: string;
  /** Anything for the header's right side: a button, a total, a badge. */
  actions?: ReactNode;
  padding?: keyof typeof PADDING;
  className?: string;
  children: ReactNode;
};

/** A Glass card with consistent padding and an optional header. */
export function GlassPanel({
  title,
  description,
  actions,
  padding = "md",
  className = "",
  children,
}: GlassPanelProps) {
  const hasHeader = title || description || actions;

  return (
    <Glass className={`flex flex-col gap-5 rounded-3xl ${PADDING[padding]} ${className}`}>
      {hasHeader && (
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
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