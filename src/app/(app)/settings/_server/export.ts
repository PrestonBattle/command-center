import "server-only";

import { getCurrentOrg, getDataLayer } from "@/global/data";
import { todayIso } from "@/global/lib/dates";
import { exportTable, type ExportKey } from "../_lib/export-tables";
import { toCsv } from "../_lib/to-csv";

/** One export file, ready to send: its name and its CSV text. */
export type ExportFile = { filename: string; csv: string };

/**
 * Loads the signed-in org's rows and writes one export file. Every list
 * goes through the data layer, so it's scoped to this org like any page.
 */
export async function buildExport(key: ExportKey): Promise<ExportFile> {
  const [dl, org] = await Promise.all([getDataLayer(), getCurrentOrg()]);
  const [clients, contacts, services, payments, leads] = await Promise.all([
    dl.clients.list(),
    dl.contacts.list(),
    dl.clientServices.list(),
    dl.payments.list(),
    dl.leads.list(),
  ]);
  const { headers, rows } = exportTable(key, { clients, contacts, services, payments, leads });
  return { filename: `command-center-${key}-${todayIso(org.timezone)}.csv`, csv: toCsv(headers, rows) };
}
