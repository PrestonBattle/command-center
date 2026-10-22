import { Suspense } from "react";
import { BackButton } from "@/global/components/back-button";
import { PageHeader, StatusBadge } from "@/global/components/layout";
import { SectionBoundary } from "@/global/components/section-boundary";
import { SkeletonPanel } from "@/global/components/skeleton";
import { clientStatusMeta } from "@/global/lib/client-status";
import { formatShortDate } from "@/global/lib/dates";
import { ClientActions } from "./_components/client-actions";
import { ContactsSection } from "./_components/contacts-section";
import { ReceivedSection } from "./_components/received-section";
import { ServicesSection } from "./_components/services-section";
import { WonFromLead } from "./_components/won-from-lead";
import { getClient, getClientDetails, getWonFromLeadOn } from "./_server/queries";

type Props = { params: Promise<{ id: string }> };

/** One client: what they pay, who to talk to, and what they've paid. */
export default async function ClientPage({ params }: Props) {
  const { id } = await params;
  // Started first so they load while the client row is fetched.
  const detailsPromise = getClientDetails(id);
  // If the client turns out not to exist, nothing awaits this; the empty
  // catch stops an unawaited failure being reported as unhandled. The
  // sections still see the rejection.
  detailsPromise.catch(() => {});
  const wonOnPromise = getWonFromLeadOn(id).catch(() => null);
  // The one awaited load: the name is the title, and a missing client is a
  // 404 (see getClient).
  const client = await getClient(id);
  const status = clientStatusMeta(client.status);

  return (
    <>
      <BackButton href="/clients" text="Clients" className="self-start" />
      <PageHeader
        title={client.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            Client since {formatShortDate(client.signed_on)}
            <Suspense fallback={null}>
              <WonFromLead datePromise={wonOnPromise} />
            </Suspense>
          </span>
        }
        actions={<ClientActions clientId={client.id} clientName={client.name} status={client.status} />}
      />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <SectionBoundary skeleton={<SkeletonPanel title="Services" label="services" />} errorMessage="Couldn't load their services.">
          <ServicesSection clientId={client.id} detailsPromise={detailsPromise} />
        </SectionBoundary>
        <SectionBoundary skeleton={<SkeletonPanel title="Contacts" label="contacts" lines={2} />} errorMessage="Couldn't load their contacts.">
          <ContactsSection clientId={client.id} detailsPromise={detailsPromise} />
        </SectionBoundary>
        <SectionBoundary skeleton={<SkeletonPanel title="Payments received" label="payments" />} errorMessage="Couldn't load their payments.">
          <ReceivedSection detailsPromise={detailsPromise} />
        </SectionBoundary>
      </div>
    </>
  );
}
