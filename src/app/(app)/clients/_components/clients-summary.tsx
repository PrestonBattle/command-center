import { formatCents } from "@/global/lib/money";
import type { ClientsView } from "../_server/queries";

/**
 * "12 clients · $8,400/mo recurring", under the page title. Gets a promise
 * that never rejects (null on failure): if the load fails, the grid's
 * boundary shows the error once, and this line just stays empty.
 */
export async function ClientsSummary({ viewPromise }: { viewPromise: Promise<ClientsView | null> }) {
  const view = await viewPromise;
  // A blank line rather than nothing, so the header keeps its height and
  // the Add button doesn't jump.
  if (!view) return <span aria-hidden>&nbsp;</span>;
  return (
    <>
      {view.total} {view.total === 1 ? "client" : "clients"} · {formatCents(view.recurringCents)}/mo recurring
    </>
  );
}
