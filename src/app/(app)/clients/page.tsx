import { Suspense } from "react";
import { PageHeader } from "@/global/components/layout";
import { SectionBoundary } from "@/global/components/section-boundary";
import { SkeletonLine } from "@/global/components/skeleton";
import { AddClientButton } from "./_components/add-client-button";
import { ClientsSection } from "./_components/clients-section";
import { ClientsSkeleton } from "./_components/clients-skeleton";
import { ClientsSummary } from "./_components/clients-summary";
import { ClientsToolbar } from "./_components/clients-toolbar";
import { getClientsView } from "./_server/queries";

type Props = { searchParams: Promise<{ q?: string; status?: string }> };

/** Every client as a card, with search and a status filter. */
export default async function ClientsPage({ searchParams }: Props) {
  // The URL is read up front (it's not data, and the toolbar needs it now);
  // the query starts here and streams into the sections below.
  const { q = "", status = "all" } = await searchParams;
  const viewPromise = getClientsView({ q, status });
  const summaryPromise = viewPromise.catch(() => null);

  return (
    <>
      <PageHeader
        title="Clients"
        description={
          <Suspense fallback={<SkeletonLine width="w-56" height="h-4" className="my-1" />}>
            <ClientsSummary viewPromise={summaryPromise} />
          </Suspense>
        }
        actions={<AddClientButton />}
      />
      <ClientsToolbar query={q} status={status} />
      <SectionBoundary skeleton={<ClientsSkeleton />} errorMessage="Couldn't load your clients.">
        <ClientsSection viewPromise={viewPromise} />
      </SectionBoundary>
    </>
  );
}
