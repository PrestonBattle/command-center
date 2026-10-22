import type { ReactNode } from "react";

type SkeletonRegionProps = {
  /** What's loading, read as "Loading clients…". */
  label: string;
  className?: string;
  children: ReactNode;
};

/**
 * Wraps a section's skeleton. Marks the area busy and says once, politely,
 * what's loading, so screen-reader users hear "Loading clients…" rather than
 * silence or a pile of empty shapes. Every section skeleton starts with this.
 */
export function SkeletonRegion({ label, className = "", children }: SkeletonRegionProps) {
  return (
    <div aria-busy="true" className={className}>
      <span role="status" className="sr-only">
        Loading {label}…
      </span>
      {children}
    </div>
  );
}
