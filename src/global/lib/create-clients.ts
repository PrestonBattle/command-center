import "server-only";

import type { DataLayer } from "@/global/data";
import type { ClientRowValues } from "@/global/lib/schemas/client";

/** What each new client's recurring service is called until it's renamed. */
export const DEFAULT_SERVICE_NAME = "Services";

/**
 * Creates clients from validated rows: the client, a primary contact when
 * there's an email, and one recurring service. Returns the new client ids.
 *
 * Ids are made here so contacts and services can point at their client
 * without waiting for the insert. The three inserts aren't one transaction,
 * so if a later one fails the new clients are deleted (contacts and services
 * cascade with them) before the error is rethrown.
 */
export async function createClientsWithServices(
  dl: DataLayer,
  rows: ClientRowValues[],
  startedOn: string,
): Promise<string[]> {
  if (rows.length === 0) return [];
  const entries = rows.map((row) => ({ id: crypto.randomUUID(), row }));

  await dl.clients.insertMany(entries.map(({ id, row }) => ({ id, name: row.name })));

  try {
    await dl.contacts.insertMany(
      entries
        .filter(({ row }) => row.email)
        .map(({ id, row }) => ({ client_id: id, name: row.name, email: row.email ?? null, is_primary: true })),
    );
    await dl.clientServices.insertMany(
      entries.map(({ id, row }) => ({
        client_id: id,
        name: DEFAULT_SERVICE_NAME,
        amount_cents: row.amount,
        interval_months: row.interval_months,
        started_on: startedOn,
      })),
    );
  } catch (e) {
    await dl.clients.remove(entries.map((entry) => entry.id)).catch(() => {});
    throw e;
  }

  return entries.map((entry) => entry.id);
}
