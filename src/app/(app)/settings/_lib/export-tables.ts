import { clientStatusMeta } from "@/global/lib/client-status";
import { intervalLabel } from "@/global/lib/intervals";
import { LEAD_STAGES } from "@/global/lib/lead-stages";
import { centsToDollars } from "@/global/lib/money";
import type { ClientRow, ClientServiceRow, ContactRow, LeadRow, PaymentRow } from "@/global/types/supabase/types";
import type { CsvCell } from "./to-csv";

/*
 * What "Export my data" writes, one table per file. Amounts are dollars
 * (numbers, so spreadsheets can add them up) and every row that belongs to
 * a client carries the client's name, so each file reads on its own.
 */

/** Everything an export can draw on. */
export type ExportSource = {
  clients: ClientRow[];
  contacts: ContactRow[];
  services: ClientServiceRow[];
  payments: PaymentRow[];
  leads: LeadRow[];
};

/** One file's columns and rows. */
export type ExportTable = { headers: string[]; rows: CsvCell[][] };

/** The files people can download, in the order Settings lists them. */
export const EXPORTS = [
  { key: "clients", label: "Clients" },
  { key: "contacts", label: "Contacts" },
  { key: "services", label: "Services" },
  { key: "payments", label: "Payments" },
  { key: "leads", label: "Leads" },
] as const;

export type ExportKey = (typeof EXPORTS)[number]["key"];

/** True for a key Settings offers; anything else in the URL is a 404. */
export function isExportKey(value: string): value is ExportKey {
  return EXPORTS.some((e) => e.key === value);
}

const byName = <T extends { name: string }>(a: T, b: T) => a.name.localeCompare(b.name);

/** Builds one export file's table from the org's rows. */
export function exportTable(key: ExportKey, src: ExportSource): ExportTable {
  const clientName = new Map(src.clients.map((c) => [c.id, c.name]));
  const nameOf = (id: string) => clientName.get(id) ?? "";

  switch (key) {
    case "clients":
      return {
        headers: ["Name", "Status", "Client since", "Website", "Notes"],
        rows: [...src.clients].sort(byName).map((c) => [c.name, clientStatusMeta(c.status).label, c.signed_on, c.website, c.notes]),
      };
    case "contacts":
      return {
        headers: ["Client", "Name", "Role", "Email", "Phone", "Primary"],
        rows: src.contacts.map((c) => [nameOf(c.client_id), c.name, c.role, c.email, c.phone, c.is_primary ? "Yes" : "No"]),
      };
    case "services":
      return {
        headers: ["Client", "Service", "Amount per payment ($)", "How often", "Started", "Ended"],
        rows: src.services.map((s) => [nameOf(s.client_id), s.name, centsToDollars(s.amount_cents), intervalLabel(s.interval_months), s.started_on, s.ended_on]),
      };
    case "payments":
      return {
        headers: ["Client", "Amount ($)", "Due", "Paid on"],
        rows: [...src.payments]
          .sort((a, b) => a.due_on.localeCompare(b.due_on))
          .map((p) => [nameOf(p.client_id), centsToDollars(p.amount_cents), p.due_on, p.paid_on]),
      };
    case "leads":
      return {
        headers: ["Name", "Contact", "Email", "Phone", "Stage", "Worth per month ($)", "Added"],
        rows: [...src.leads].sort(byName).map((l) => [
          l.name,
          l.contact_name,
          l.email,
          l.phone,
          LEAD_STAGES.find((s) => s.value === l.stage)?.label ?? l.stage,
          l.estimated_monthly_cents === null ? null : centsToDollars(l.estimated_monthly_cents),
          l.created_at.slice(0, 10),
        ]),
      };
  }
}
