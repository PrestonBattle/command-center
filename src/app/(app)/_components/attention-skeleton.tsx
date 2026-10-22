import { GlassPanel } from "@/global/components/glass/glass-panel";
import { SkeletonLine, SkeletonRegion } from "@/global/components/skeleton";

/**
 * Needs attention in loading state: the real title and three item rows.
 * Takes the same className as the panel, so on wide screens it fills the
 * Snapshot's height the same way.
 */
export function AttentionSkeleton({ className = "" }: { className?: string }) {
  return (
    <SkeletonRegion label="what needs attention" className={className}>
      <GlassPanel title="Needs attention" className="h-full">
        <div className="flex flex-col">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex gap-3 border-t border-[var(--divider)] py-3 first:border-t-0"
            >
              <SkeletonLine
                width="w-5"
                height="h-5"
                className="shrink-0 rounded-full"
              />
              <div className="flex flex-1 flex-col gap-2">
                <SkeletonLine width={i === 1 ? "w-36" : "w-44"} height="h-4" />
                <SkeletonLine width="w-32" />
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </SkeletonRegion>
  );
}
