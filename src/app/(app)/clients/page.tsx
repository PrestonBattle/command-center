import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { EmptyState, PageHeader } from "@/global/components/layout";
import { getCurrentOrg, getDataLayer } from "@/global/data";
import { todayIso } from "@/global/lib/dates";
import { formatCents } from "@/global/lib/money";
import { ClientCard } from "./_components/client-card";
import { ClientsToolbar } from "./_components/clients-toolbar";
import { filterClients, summarizeClients } from "./_lib/client-summaries";

type Props = { searchParams: Promise<{ q?: string; status?: string }> };

/** Every client as a card, with search and a status filter. */
export default async function ClientsPage({ searchParams }: Props) {
  const { q = "", status = "all" } = await searchParams;
  const [org, dl] = await Promise.all([getCurrentOrg(), getDataLayer()]);
  const [clients, contacts, services] = await Promise.all([dl.clients.list(), dl.contacts.list(), dl.clientServices.list()]);

  const all = summarizeClients(clients, contacts, services, todayIso(org.timezone));
  const shown = filterClients(all, q, status);
  const recurring = all.filter((c) => c.status === "active" || c.status === "onboarding").reduce((t, c) => t + c.monthlyCents, 0);
  const addButton = (
    <Button component={Link} href="/clients/new" leftSection={<IconPlus size={18} aria-hidden />}>
      Add client
    </Button>
  );

  return (
    <>
      <PageHeader title="Clients" description={`${all.length} clients · ${formatCents(recurring)}/mo recurring`} actions={addButton} />
      <ClientsToolbar query={q} status={status} />
      {shown.length === 0 ? (
        <EmptyState
          title={all.length === 0 ? "No clients yet" : "No clients match"}
          description={all.length === 0 ? "Add the people who pay you, and what they pay." : "Try a different search or filter."}
          action={all.length === 0 ? addButton : undefined}
        />
      ) : (
        <ul aria-label="Clients" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((c) => (
            <ClientCard key={c.id} client={c} />
          ))}
        </ul>
      )}
    </>
  );
}
