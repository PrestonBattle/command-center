import { PageHeader } from "@/global/components/layout";
import { SectionBoundary } from "@/global/components/section-boundary";
import { AttentionSection } from "./_components/attention-section";
import { AttentionSkeleton } from "./_components/attention-skeleton";
import { DashboardStats } from "./_components/dashboard-stats";
import { PaymentsSection } from "./_components/payments-section";
import { PaymentsSkeleton } from "./_components/payments-skeleton";
import { SnapshotSection } from "./_components/snapshot-section";
import { SnapshotSkeleton } from "./_components/snapshot-skeleton";
import { StatsSkeleton } from "./_components/stats-skeleton";
import { getBusinessView, getGreetingTitle, getPipelineView } from "./_server/queries";

/** The dashboard: am I OK this month, what's coming in, and what needs doing. */
export default async function DashboardPage() {
  // Two loads, started together and shared by the sections that need them:
  // a section that fails says so on its own, and the rest still shows.
  const businessPromise = getBusinessView();
  const pipelinePromise = getPipelineView();
  // Free: the org and member were loaded by the app layout (see the query).
  const title = await getGreetingTitle();

  return (
    <>
      <PageHeader title={title} description="Here's where things stand this month." />
      <SectionBoundary skeleton={<StatsSkeleton />} errorMessage="Couldn't load this month's numbers.">
        <DashboardStats businessPromise={businessPromise} pipelinePromise={pipelinePromise} />
      </SectionBoundary>
      {/* Snapshot sets this row's height; Needs attention matches it and
          scrolls inside (it's taken out of the row's sizing with absolute
          positioning). Below lg everything stacks at its natural height. */}
      <div className="grid gap-6 lg:min-h-72 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SectionBoundary skeleton={<SnapshotSkeleton />} errorMessage="Couldn't load your Snapshot.">
          <SnapshotSection businessPromise={businessPromise} />
        </SectionBoundary>
        <div className="relative min-w-0">
          <SectionBoundary
            skeleton={<AttentionSkeleton className="lg:absolute lg:inset-0" />}
            errorMessage="Couldn't load what needs attention."
          >
            <AttentionSection businessPromise={businessPromise} pipelinePromise={pipelinePromise} className="lg:absolute lg:inset-0" />
          </SectionBoundary>
        </div>
      </div>
      <SectionBoundary skeleton={<PaymentsSkeleton />} errorMessage="Couldn't load this month's payments.">
        <PaymentsSection businessPromise={businessPromise} />
      </SectionBoundary>
    </>
  );
}
