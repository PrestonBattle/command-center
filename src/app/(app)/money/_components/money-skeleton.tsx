import { GlassPanel } from "@/global/components/glass/glass-panel";
import { SkeletonLine, SkeletonRegion, SkeletonRows } from "@/global/components/skeleton";

/** The collected bar and the payments table in loading state, at their real sizes. */
export function MoneySkeleton() {
  return (
    <SkeletonRegion label="payments" className="flex flex-col gap-6">
      <GlassPanel>
        <SkeletonLine width="w-20" />
        <SkeletonLine width="w-72" height="h-10" />
        <SkeletonLine height="h-3.5" className="rounded-full" />
        <div className="flex flex-wrap gap-6">
          <SkeletonLine width="w-24" />
          <SkeletonLine width="w-28" />
          <SkeletonLine width="w-32" />
        </div>
      </GlassPanel>
      <GlassPanel>
        <SkeletonLine width="w-48" height="h-5" />
        <SkeletonRows rows={5} />
      </GlassPanel>
    </SkeletonRegion>
  );
}
