import "server-only";

import { getCurrentOrg, getDataLayer } from "@/global/data";
import { todayIso } from "@/global/lib/dates";
import { paginate, type Page } from "@/global/lib/paging";
import { filterClients, summarizeClients, type ClientSummary } from "../_lib/client-summaries";

/** Everything the Clients page shows, already filtered by the URL. */
export type ClientsView = {
  /** How many clients there are in all, before search and filter. */
  total: number;
  /** Monthly recurring from active and onboarding clients, in cents. */
  recurringCents: number;
  /** This page of the clients that match ?q= and ?status=. */
  shown: Page<ClientSummary>;
};

/** Cards per page: enough to scan, few enough to stay quick on a phone. */
export const CLIENTS_PER_PAGE = 50;

/**
 * Loads clients, their primary contacts and services, and shapes them for
 * the page. The header totals describe every client, not just the matches,
 * so they don't jump around as you type a search.
 */
export async function getClientsView({ q, status, page }: { q: string; status: string; page: number }): Promise<ClientsView> {
  const [org, dl] = await Promise.all([getCurrentOrg(), getDataLayer()]);
  const [clients, contacts, services] = await Promise.all([dl.clients.list(), dl.contacts.list(), dl.clientServices.list()]);

  const all = summarizeClients(clients, contacts, services, todayIso(org.timezone));
  const recurringCents = all
    .filter((c) => c.status === "active" || c.status === "onboarding")
    .reduce((t, c) => t + c.monthlyCents, 0);

  return { total: all.length, recurringCents, shown: paginate(filterClients(all, q, status), page, CLIENTS_PER_PAGE) };
}
