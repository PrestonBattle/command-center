import { EmptyState } from "@/global/components/layout";
import { Pager } from "@/global/components/pager";
import { pageHref } from "@/global/lib/paging";
import type { ClientsView } from "../_server/queries";
import { AddClientButton } from "./add-client-button";
import { ClientCard } from "./client-card";

type Props = {
  viewPromise: Promise<ClientsView>;
  /** The current ?q= and ?status=, kept on the page links. */
  params: { q: string; status: string };
};

/**
 * The client grid, once the data is in, one page at a time. Two empty
 * states: no clients at all (invite them to add one), or none matching the
 * search (suggest changing it).
 */
export async function ClientsSection({ viewPromise, params }: Props) {
  const { total, shown } = await viewPromise;

  if (shown.total === 0) {
    return total === 0 ? (
      <EmptyState title="No clients yet" description="Add the people who pay you, and what they pay." action={<AddClientButton />} />
    ) : (
      <EmptyState title="No clients match" description="Try a different search or filter." />
    );
  }

  // "all" is the default status, so it stays out of the links.
  const linkParams = { q: params.q, status: params.status === "all" ? "" : params.status };
  const href = (page: number) => pageHref("/clients", linkParams, page);
  return (
    <>
      <ul aria-label="Clients" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.items.map((c) => (
          <ClientCard key={c.id} client={c} />
        ))}
      </ul>
      <Pager
        page={shown.page}
        pageCount={shown.pageCount}
        summary={`${shown.from}–${shown.to} of ${shown.total} clients`}
        prevHref={href(shown.page - 1)}
        nextHref={href(shown.page + 1)}
      />
    </>
  );
}
