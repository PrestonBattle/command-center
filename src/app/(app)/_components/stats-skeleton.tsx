import { GlassPanel } from "@/global/components/glass/glass-panel";
import { SkeletonLine, SkeletonRegion } from "@/global/components/skeleton";

/** The three compact stats in loading state, at the same size as `Stat compact`. */
export function StatsSkeleton() {
  return (
    <SkeletonRegion label="this month's numbers" className="grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <GlassPanel key={i} padding="sm" className="gap-2 px-5 py-3.5">
          <SkeletonLine width="w-32" />
          <SkeletonLine width="w-24" height="h-7" />
          <SkeletonLine width="w-28" />
        </GlassPanel>
      ))}
    </SkeletonRegion>
  );
}
