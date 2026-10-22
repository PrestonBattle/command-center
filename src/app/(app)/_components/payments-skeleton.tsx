import { GlassPanel } from "@/global/components/glass/glass-panel";
import { SkeletonRegion, SkeletonRows } from "@/global/components/skeleton";

/** Payments this month in loading state: the real title and a few rows. */
export function PaymentsSkeleton() {
  return (
    <SkeletonRegion label="this month's payments">
      <GlassPanel title="Payments this month">
        <SkeletonRows rows={3} />
      </GlassPanel>
    </SkeletonRegion>
  );
}
