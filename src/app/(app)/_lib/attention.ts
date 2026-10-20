import type { ScheduledPayment } from "@/global/lib/billing";
import { formatShortDate } from "@/global/lib/dates";
import { formatCents } from "@/global/lib/money";

/** One thing on the dashboard that needs a look, worst first. */
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
 * What needs attention: overdue payments, stale leads, and setup gaps.
 * Pure, so the dashboard just renders whatever this returns.
 */
export function attentionItems({ overdue, staleLeads, floorCents, clientCount }: Input): AttentionItem[] {
  const items: AttentionItem[] = overdue.map((p) => ({
    id: `overdue-${p.key}`,
    tone: "bad",
    title: `${p.clientName} owes ${formatCents(p.amountCents)}`,
    detail: `Was due ${formatShortDate(p.dueOn)}`,
    href: "/money",
  }));

  for (const lead of staleLeads) {
    items.push({
      id: `stale-${lead.name}`,
      tone: "warn",
      title: `${lead.name} hasn't moved in ${lead.days} days`,
      detail: "Follow up or mark it lost",
      href: "/leads",
    });
  }

  if (floorCents === 0) {
    items.push({ id: "no-floor", tone: "warn", title: "Your floor isn't set", detail: "Add your monthly costs", href: "/life-vest" });
  }
  if (clientCount === 0) {
    items.push({ id: "no-clients", tone: "warn", title: "No clients yet", detail: "Add who pays you", href: "/clients/new" });
  }
  return items;
}
