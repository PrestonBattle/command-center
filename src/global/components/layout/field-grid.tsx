import type { ReactNode } from "react";

/*
 * Written out in full: Tailwind only generates classes it can see whole in
 * the source, so `grid-cols-${n}` would silently do nothing.
 */
const COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
} as const;

type FieldGridProps = {
  cols?: keyof typeof COLS;
  children: ReactNode;
};

/** Responsive grid for form fields: collapses to one column on phones. */
export function FieldGrid({ cols = 2, children }: FieldGridProps) {
  return <div className={`grid gap-4 ${COLS[cols]}`}>{children}</div>;
}
