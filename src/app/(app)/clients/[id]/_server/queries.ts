import "server-only";

import { notFound } from "next/navigation";
import { cache } from "react";
import { getCurrentOrg, getDataLayer } from "@/global/data";
import { todayIso } from "@/global/lib/dates";
import type { ClientRow, ClientServiceRow, ContactRow, PaymentRow } from "@/global/types/supabase/types";
import { clientIdSchema } from "../../_lib/schemas";

/** One client's services, contacts and received payments. */
export type ClientDetails = {
  services: ClientServiceRow[];
  contacts: ContactRow[];
  /** Only payments actually received. */
  payments: PaymentRow[];
  today: string;
};

/**
 * The client row, or a real 404. The page awaits this one (one row, fast):
 * the title is the client's name, and a missing client must be a 404 before
 * anything streams, not an empty page that says 200.
 */
export const getClient = cache(async (id: string): Promise<ClientRow> => {
  if (!clientIdSchema.safeParse(id).success) notFound();
  const dl = await getDataLayer();
  const client = await dl.clients.get(id);
  if (!client) notFound();
  return client;
});

/** The client's services, contacts and payments, shared by the three panels. */
export async function getClientDetails(id: string): Promise<ClientDetails> {
  const [org, dl] = await Promise.all([getCurrentOrg(), getDataLayer()]);
  const [contacts, services, payments] = await Promise.all([dl.contacts.list(), dl.clientServices.list(), dl.payments.list()]);
  return {
    services: services.filter((s) => s.client_id === id),
    contacts: contacts.filter((c) => c.client_id === id),
    payments: payments.filter((p) => p.client_id === id && p.paid_on),
    today: todayIso(org.timezone),
  };
}

/**
 * When this client was won from a lead, if they were. The board drops old
 * wins, so this is where that history stays visible.
 */
export async function getWonFromLeadOn(id: string): Promise<string | null> {
  const dl = await getDataLayer();
  const leads = await dl.leads.list();
  return leads.find((l) => l.converted_client_id === id)?.stage_changed_at.slice(0, 10) ?? null;
}
