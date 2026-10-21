import type { ScheduledPayment } from "@/global/lib/billing";
import { formatShortDate } from "@/global/lib/dates";
import { STALE_AFTER_DAYS } from "@/global/lib/lead-stages";
import { formatCents } from "@/global/lib/money";

/** One thing on the dashboard that needs a look. */
export type AttentionItem = {
  id: string;
  tone: "bad" | "warn" | "ok";
  title: string;
  detail: string;
  href: string;
};

type Input = {
  overdue: ScheduledPayment[];
  staleLeads: { name: string; days: number }[];
  floorCents: number;
  clientCount: number;
};

/**
 * What needs attention, grouped so a busy month is a handful of lines, not
 * thirty:
 * 1. Setup gaps first. Without a floor every other number on the dashboard
 *    is guesswork, so it outranks even money owed.
 * 2. One line per client that owes money, oldest debt first.
 * 3. Stale leads: by name if there's one, as a single line if there are more.
 * Pure, so the dashboard just renders whatever this returns.
 */
export function attentionItems({ overdue, staleLeads, floorCents, clientCount }: Input): AttentionItem[] {
  const items: AttentionItem[] = [];

  if (floorCents === 0) {
    items.push({ id: "no-floor", tone: "warn", title: "Your floor isn't set", detail: "Add your costs so the Snapshot can show where you stand", href: "/life-vest" });
  }
  if (clientCount === 0) {
    items.push({ id: "no-clients", tone: "warn", title: "No clients yet", detail: "Add who pays you", href: "/clients/new" });
  }

  for (const debt of groupByClient(overdue)) {
    items.push({
      id: `overdue-${debt.clientId}`,
      tone: "bad",
      title: `${debt.clientName} owes ${formatCents(debt.totalCents)}`,
      detail: debt.count === 1 ? `Was due ${formatShortDate(debt.oldestDue)}` : `${debt.count} payments · oldest due ${formatShortDate(debt.oldestDue)}`,
      href: "/money",
    });
  }

  if (staleLeads.length === 1) {
    const [lead] = staleLeads;
    items.push({ id: "stale-leads", tone: "warn", title: `${lead.name} hasn't moved in ${lead.days} days`, detail: "Follow up or mark it lost", href: "/leads" });
  } else if (staleLeads.length > 1) {
    const longest = Math.max(...staleLeads.map((l) => l.days));
    items.push({
      id: "stale-leads",
      tone: "warn",
      title: `${staleLeads.length} leads haven't moved in ${STALE_AFTER_DAYS}+ days`,
      detail: `Longest: ${longest} days · follow up or mark them lost`,
      href: "/leads",
    });
  }

  return items;
}

type Debt = { clientId: string; clientName: string; totalCents: number; count: number; oldestDue: string };

/** Overdue payments summed per client, the client owed longest first. */
function groupByClient(overdue: ScheduledPayment[]): Debt[] {
  const byClient = new Map<string, Debt>();
  for (const p of overdue) {
    const d = byClient.get(p.clientId) ?? { clientId: p.clientId, clientName: p.clientName, totalCents: 0, count: 0, oldestDue: p.dueOn };
    d.totalCents += p.amountCents;
    d.count += 1;
    if (p.dueOn < d.oldestDue) d.oldestDue = p.dueOn;
    byClient.set(p.clientId, d);
  }
  return [...byClient.values()].sort((a, b) => a.oldestDue.localeCompare(b.oldestDue));
}
