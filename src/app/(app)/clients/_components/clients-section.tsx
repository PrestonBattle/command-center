import { EmptyState } from "@/global/components/layout";
import type { ClientsView } from "../_server/queries";
import { AddClientButton } from "./add-client-button";
import { ClientCard } from "./client-card";

/**
 * The client grid, once the data is in. Two empty states: no clients at
 * all (invite them to add one), or none matching the search (suggest
 * changing it).
 */
export async function ClientsSection({ viewPromise }: { viewPromise: Promise<ClientsView> }) {
  const { total, shown } = await viewPromise;

  if (shown.length === 0) {
    return total === 0 ? (
      <EmptyState title="No clients yet" description="Add the people who pay you, and what they pay." action={<AddClientButton />} />
    ) : (
      <EmptyState title="No clients match" description="Try a different search or filter." />
    );
  }

  return (
    <ul aria-label="Clients" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {shown.map((c) => (
        <ClientCard key={c.id} client={c} />
      ))}
    </ul>
  );
}
