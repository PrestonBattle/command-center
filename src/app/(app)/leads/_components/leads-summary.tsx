import { formatCents } from "@/global/lib/money";
import type { LeadsView } from "../_server/queries";

/**
 * "25 open · $17,695/mo if they all close", under the page title. Gets a
 * promise that never rejects (null on failure): the board's boundary shows
 * the error once, and this line stays blank.
 */
export async function LeadsSummary({ viewPromise }: { viewPromise: Promise<LeadsView | null> }) {
  const view = await viewPromise;
  // A blank line keeps the header's height, so Add lead doesn't jump.
  if (!view) return <span aria-hidden>&nbsp;</span>;
  return (
    <>
      {view.openCount} open · {formatCents(view.potentialCents)}/mo if they all close
    </>
  );
}
