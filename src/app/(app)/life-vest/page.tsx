import { PageHeader } from "@/global/components/layout";
import { SectionBoundary } from "@/global/components/section-boundary";
import { SkeletonLine, SkeletonPanel } from "@/global/components/skeleton";
import { CoverageSection } from "./_components/coverage-section";
import { FloorSection } from "./_components/floor-section";
import { WhatIfSection } from "./_components/what-if-section";
import { getLifeVestView } from "./_server/queries";

/** The floor: how much revenue the business needs, how covered it is, and what could change that. */
export default function LifeVestPage() {
  const viewPromise = getLifeVestView();

  return (
    <>
      <PageHeader title="Life vest" description="Your floor, and what would sink it." />
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <SectionBoundary
          errorMessage="Couldn't load your coverage."
          skeleton={
            <SkeletonPanel title="If nothing changes" label="your coverage">
              <SkeletonLine width="w-40" height="h-14" />
              <SkeletonLine height="h-3" className="rounded-full" />
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => <SkeletonLine key={i} height="h-20" className="rounded-xl" />)}
              </div>
            </SkeletonPanel>
          }
        >
          <CoverageSection viewPromise={viewPromise} />
        </SectionBoundary>
        <SectionBoundary skeleton={<SkeletonPanel title="What if…" label="what if" lines={4} />} errorMessage="Couldn't load What if.">
          <WhatIfSection viewPromise={viewPromise} />
        </SectionBoundary>
      </div>
      <SectionBoundary
        errorMessage="Couldn't load your costs."
        skeleton={
          <SkeletonPanel title="Your monthly costs" label="your costs">
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => <SkeletonLine key={i} height="h-12" className="rounded-lg" />)}
            </div>
          </SkeletonPanel>
        }
      >
        <FloorSection viewPromise={viewPromise} />
      </SectionBoundary>
    </>
  );
}
