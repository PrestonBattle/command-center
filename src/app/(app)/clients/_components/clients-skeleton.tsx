import { GlassPanel } from "@/global/components/glass/glass-panel";
import { SkeletonLine, SkeletonRegion } from "@/global/components/skeleton";

/** Six client cards in loading state, laid out like the real grid. */
export function ClientsSkeleton() {
  return (
    <SkeletonRegion label="clients" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <GlassPanel key={i} padding="sm" className="gap-4 p-5">
          <div className="flex items-center gap-3">
            <SkeletonLine width="w-11" height="h-11" className="shrink-0 rounded-2xl" />
            <SkeletonLine width={i % 2 ? "w-28" : "w-36"} height="h-5" />
            <SkeletonLine width="w-16" height="h-6" className="ml-auto rounded-full" />
          </div>
          <SkeletonLine width="w-28" height="h-8" />
          <SkeletonLine width="w-40" />
        </GlassPanel>
      ))}
    </SkeletonRegion>
  );
}
