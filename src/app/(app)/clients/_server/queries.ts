import "server-only";

import { getCurrentOrg, getDataLayer } from "@/global/data";
import { todayIso } from "@/global/lib/dates";
import { filterClients, summarizeClients, type ClientSummary } from "../_lib/client-summaries";

/** Everything the Clients page shows, already filtered by the URL. */
export type ClientsView = {
  /** How many clients there are in all, before search and filter. */
  total: number;
  /** Monthly recurring from active and onboarding clients, in cents. */
  recurringCents: number;
  /** The clients that match ?q= and ?status=. */
  shown: ClientSummary[];
};

/**
 * Loads clients, their primary contacts and services, and shapes them for
 * the page. The header totals describe every client, not just the matches,
 * so they don't jump around as you type a search.
 */
export async function getClientsView({ q, status }: { q: string; status: string }): Promise<ClientsView> {
  const [org, dl] = await Promise.all([getCurrentOrg(), getDataLayer()]);
  const [clients, contacts, services] = await Promise.all([dl.clients.list(), dl.contacts.list(), dl.clientServices.list()]);

  const all = summarizeClients(clients, contacts, services, todayIso(org.timezone));
  const recurringCents = all
    .filter((c) => c.status === "active" || c.status === "onboarding")
    .reduce((t, c) => t + c.monthlyCents, 0);

  return { total: all.length, recurringCents, shown: filterClients(all, q, status) };
}
