type SkeletonLineProps = {
  /** A Tailwind width: "w-1/2", "w-24". Vary widths so it reads as text. */
  width?: string;
  /** A Tailwind height: "h-3" for small text, "h-8" for a big figure. */
  height?: string;
  className?: string;
};

/**
 * One grey bar standing in for a line of text or a number while it loads.
 * Pulses, except with reduced motion. Hidden from screen readers: the
 * surrounding SkeletonRegion says "Loading…" once instead.
 */
export function SkeletonLine({ width = "w-full", height = "h-3.5", className = "" }: SkeletonLineProps) {
  return (
    <span
      aria-hidden
      className={`block animate-pulse rounded-md bg-[var(--skeleton)] motion-reduce:animate-none ${width} ${height} ${className}`}
    />
  );
}
