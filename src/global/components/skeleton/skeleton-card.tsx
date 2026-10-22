import { GlassPanel } from "../glass/glass-panel";
import { SkeletonLine } from "./skeleton-line";

type SkeletonCardProps = {
  /** Text lines under the title. */
  lines?: number;
  /** A large figure line (a dollar amount) under the title. */
  figure?: boolean;
  className?: string;
};

/**
 * A glass card in loading state: a title bar, an optional big figure, and a
 * few text lines of varying width. Close enough to a client card, stat or
 * panel that nothing jumps when the real one replaces it.
 */
export function SkeletonCard({ lines = 2, figure = false, className = "" }: SkeletonCardProps) {
  const widths = ["w-3/4", "w-1/2", "w-2/3", "w-5/12"];
  return (
    <GlassPanel className={className}>
      <SkeletonLine width="w-2/5" height="h-4" />
      {figure && <SkeletonLine width="w-1/3" height="h-8" />}
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonLine key={i} width={widths[i % widths.length]} />
      ))}
    </GlassPanel>
  );
}
