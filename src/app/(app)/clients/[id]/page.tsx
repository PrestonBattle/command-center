import { notFound } from "next/navigation";
import { BackButton } from "@/global/components/back-button";
import { PageHeader, StatusBadge } from "@/global/components/layout";
import { getCurrentOrg, getDataLayer } from "@/global/data";
import { clientStatusMeta } from "@/global/lib/client-status";
import { formatShortDate, todayIso } from "@/global/lib/dates";
import { clientIdSchema } from "../_lib/schemas";
import { ClientActions } from "./_components/client-actions";
import { ContactsPanel } from "./_components/contacts-panel";
import { PaymentsPanel } from "./_components/payments-panel";
import { ServicesPanel } from "./_components/services-panel";

type Props = { params: Promise<{ id: string }> };

/** One client: what they pay, who to talk to, and what they've paid. */
export default async function ClientPage({ params }: Props) {
  const { id } = await params;
  if (!clientIdSchema.safeParse(id).success) notFound();

  const [org, dl] = await Promise.all([getCurrentOrg(), getDataLayer()]);
  const client = await dl.clients.get(id);
  if (!client) notFound();

  const [contacts, services, payments] = await Promise.all([dl.contacts.list(), dl.clientServices.list(), dl.payments.list()]);
  const status = clientStatusMeta(client.status);
  const today = todayIso(org.timezone);

  return (
    <>
      <BackButton href="/clients" text="Clients" className="self-start" />
      <PageHeader
        title={client.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            Client since {formatShortDate(client.signed_on)}
          </span>
        }
        actions={<ClientActions clientId={client.id} clientName={client.name} status={client.status} />}
      />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <ServicesPanel clientId={client.id} services={services.filter((s) => s.client_id === id)} today={today} />
        <ContactsPanel clientId={client.id} contacts={contacts.filter((c) => c.client_id === id)} />
        <PaymentsPanel payments={payments.filter((p) => p.client_id === id && p.paid_on)} />
      </div>
    </>
  );
}
