import { Suspense } from "react";
import { PageHeader } from "@/global/components/layout";
import { SectionBoundary } from "@/global/components/section-boundary";
import { SkeletonLine } from "@/global/components/skeleton";
import { AddLeadButton } from "./_components/add-lead-button";
import { LeadsMatchCount } from "./_components/leads-match-count";
import { LeadsSection } from "./_components/leads-section";
import { LeadsSkeleton } from "./_components/leads-skeleton";
import { LeadsSummary } from "./_components/leads-summary";
import { LeadsToolbar } from "./_components/leads-toolbar";
import { getLeadsView } from "./_server/queries";

type Props = { searchParams: Promise<{ q?: string }> };

/** The pipeline: one column per stage, filtered by ?q= when searching. */
export default async function LeadsPage({ searchParams }: Props) {
  // The URL is read up front (the search box needs it now); the query
  // starts here and streams into the header numbers and the board.
  const { q = "" } = await searchParams;
  const viewPromise = getLeadsView({ q });
  const numbersPromise = viewPromise.catch(() => null);

  return (
    <>
      <PageHeader
        title="Leads"
        description={
          <Suspense fallback={<SkeletonLine width="w-64" height="h-4" className="my-1" />}>
            <LeadsSummary viewPromise={numbersPromise} />
          </Suspense>
        }
        actions={<AddLeadButton />}
      />
      <LeadsToolbar
        query={q}
        matches={
          <Suspense fallback={null}>
            <LeadsMatchCount viewPromise={numbersPromise} query={q} />
          </Suspense>
        }
      />
      <SectionBoundary skeleton={<LeadsSkeleton />} errorMessage="Couldn't load your leads.">
        <LeadsSection viewPromise={viewPromise} query={q} />
      </SectionBoundary>
    </>
  );
}
