import "server-only";

import { getCurrentOrg, getDataLayer } from "@/global/data";
import { todayIso } from "@/global/lib/dates";
import { OPEN_STAGES } from "@/global/lib/lead-stages";
import { boardColumns, type BoardColumn } from "../_lib/board";

/** Everything the Leads page shows. Plain data, so it can go to the client board. */
export type LeadsView = {
  /** Open leads (new, contacted, proposal) in the whole pipeline. */
  openCount: number;
  /** What the open leads would bring in monthly if they all closed, in cents. */
  potentialCents: number;
  /** The board's columns, filtered by ?q=. */
  columns: BoardColumn[];
  /** How many leads the search matched, across all columns. */
  matchCount: number;
  /** Today in the org's timezone, for days-in-stage and stale badges. */
  today: string;
};

/**
 * Loads the leads and shapes the board. The header numbers describe the
 * whole pipeline, not just what the search shows.
 */
export async function getLeadsView({ q }: { q: string }): Promise<LeadsView> {
  const [org, dl] = await Promise.all([getCurrentOrg(), getDataLayer()]);
  const leads = await dl.leads.list();
  const today = todayIso(org.timezone);

  const open = leads.filter((l) => OPEN_STAGES.includes(l.stage));
  const columns = boardColumns(leads, q, today);

  return {
    openCount: open.length,
    potentialCents: open.reduce((t, l) => t + (l.estimated_monthly_cents ?? 0), 0),
    columns,
    matchCount: columns.reduce((t, c) => t + c.leads.length, 0),
    today,
  };
}
