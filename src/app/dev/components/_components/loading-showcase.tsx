"use client";

import { Button } from "@mantine/core";
import { use, useState } from "react";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { SectionBoundary } from "@/global/components/section-boundary";
import { SkeletonCard, SkeletonLine, SkeletonPanel, SkeletonRegion, SkeletonRows } from "@/global/components/skeleton";

/* Never settles, so the boundary stays on its skeleton for the demo. Only
   mounted after a click: rendered on the server it would hold the page's
   stream open and the page would never finish loading. */
const NEVER = new Promise<never>(() => {});

function Pending(): never {
  use(NEVER);
  throw new Error("unreachable");
}

function Broken(): never {
  throw new Error("Sample failure for the showcase");
}

/** Skeleton pieces and SectionBoundary's loading and failed states, for /dev. */
export function LoadingShowcase() {
  const [demo, setDemo] = useState<"loading" | "failed" | null>(null);

  return (
    <GlassPanel title="Loading and failed sections" description="SectionBoundary, SkeletonRegion and the skeleton pieces.">
      <div className="grid gap-4 sm:grid-cols-3">
        <SkeletonCard figure />
        <SkeletonCard lines={3} />
        <GlassPanel>
          <SkeletonLine width="w-1/2" height="h-6" />
          <SkeletonLine />
          <SkeletonLine width="w-2/3" />
        </GlassPanel>
      </div>
      <SkeletonPanel title="SkeletonPanel" label="a sample panel" lines={2} />
      <SkeletonRegion label="sample rows">
        <SkeletonRows rows={3} />
      </SkeletonRegion>
      <div className="flex flex-wrap gap-3">
        <Button variant="subtle" color="ink" onClick={() => setDemo("loading")}>
          Show a loading section
        </Button>
        <Button variant="subtle" color="ink" onClick={() => setDemo("failed")}>
          Show a failed section
        </Button>
      </div>
      {demo && (
        <SectionBoundary
          key={demo}
          skeleton={<SkeletonCard lines={1} />}
          errorMessage={demo === "failed" ? "Couldn't load this sample section." : "This never finishes loading."}
        >
          {demo === "failed" ? <Broken /> : <Pending />}
        </SectionBoundary>
      )}
    </GlassPanel>
  );
}
