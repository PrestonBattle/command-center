import Glass from "@/global/components/glass/glass";
import { SkeletonLine, SkeletonRegion } from "@/global/components/skeleton";

/** The Snapshot in loading state: the tank's column, the big figure and the three tiles. */
export function SnapshotSkeleton() {
  return (
    <SkeletonRegion label="your Snapshot">
      <Glass className="grid h-full grid-cols-[14px_minmax(0,1fr)] gap-5 rounded-3xl p-6">
        <SkeletonLine width="w-3.5" height="h-full" className="min-h-60 rounded-full" />
        <div className="flex flex-col gap-3">
          <SkeletonLine width="w-28" height="h-4" />
          <SkeletonLine width="w-56" height="h-10" />
          <SkeletonLine width="w-24" height="h-3" />
          <SkeletonLine width="w-72" />
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <SkeletonLine key={i} height="h-20" className="rounded-xl" />
            ))}
          </div>
        </div>
      </Glass>
    </SkeletonRegion>
  );
}
