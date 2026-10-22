import { SkeletonLine } from "./skeleton-line";

type SkeletonRowsProps = {
  rows?: number;
  className?: string;
};

/**
 * Table or list rows in loading state: a name on the left, a date and an
 * amount on the right, separated by the same hairlines as the real rows.
 */
export function SkeletonRows({ rows = 4, className = "" }: SkeletonRowsProps) {
  const names = ["w-40", "w-32", "w-48", "w-28"];
  return (
    <div className={`flex flex-col ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-t border-[var(--divider)] py-4 first:border-t-0">
          <SkeletonLine width={names[i % names.length]} height="h-4" />
          <SkeletonLine width="w-12" className="ml-auto" />
          <SkeletonLine width="w-16" height="h-4" />
        </div>
      ))}
    </div>
  );
}
