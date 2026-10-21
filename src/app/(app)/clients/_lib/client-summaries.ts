import { matchesQuery } from "@/global/lib/search";
import { isServiceActive, monthlyCents } from "@/global/lib/billing";
import type { ClientRow, ClientServiceRow, ContactRow } from "@/global/types/supabase/types";

/** What a client card shows. */
export type ClientSummary = {
  id: string;
  name: string;
  status: ClientRow["status"];
  signedOn: string;
  email: string | null;
  phone: string | null;
  monthlyCents: number;
};

/** Joins clients with their primary contact and active-service total. */
export function summarizeClients(
  clients: ClientRow[],
  contacts: ContactRow[],
  services: ClientServiceRow[],
  today: string,
): ClientSummary[] {
  const primary = new Map(contacts.filter((c) => c.is_primary).map((c) => [c.client_id, c]));
  const monthly = new Map<string, number>();
  for (const s of services) {
    if (!isServiceActive(s, today)) continue;
    monthly.set(s.client_id, (monthly.get(s.client_id) ?? 0) + monthlyCents(s));
  }
  return clients
    .map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      signedOn: c.signed_on,
      email: primary.get(c.id)?.email ?? null,
      phone: primary.get(c.id)?.phone ?? null,
      monthlyCents: monthly.get(c.id) ?? 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Keeps clients whose name or email contains the query and whose status matches. */
export function filterClients(list: ClientSummary[], query: string, status: string): ClientSummary[] {
  return list.filter((c) => (status === "all" || c.status === status) && matchesQuery(query, [c.name, c.email]));
}
