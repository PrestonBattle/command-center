import "server-only";

import { getCurrentOrg, getDataLayer } from "@/global/data";
import { getCurrentMember } from "@/global/data/user";
import { revenueByClient, scheduleForMonth, scheduleTotals, type ScheduledPayment } from "@/global/lib/billing";
import { todayIso } from "@/global/lib/dates";
import { sumExpenses } from "@/global/lib/floor";
import { daysInStage, isStale, OPEN_STAGES } from "@/global/lib/lead-stages";
import { earlierOverdue } from "../_lib/earlier-overdue";
import { greeting, hourIn } from "../_lib/greeting";
import { loadBusiness } from "../_lib/load-business";

/** The money side of the dashboard: this month's schedule and the Snapshot's inputs. */
export type BusinessView = {
  totals: ReturnType<typeof scheduleTotals>;
  /** Unpaid and past due, this month and recent months. */
  overdue: ScheduledPayment[];
  /** This month's payments not yet paid. */
  upcoming: ScheduledPayment[];
  floorCents: number;
  clientCount: number;
  /** The Snapshot's inputs, in dollars (the panel works in dollars). */
  snapshot: {
    personal: number;
    business: number;
    taxRate: number;
    revenue: number;
    topClientName?: string;
    topClientMrr?: number;
  };
};

/** The leads side: the pipeline stat and stale leads for Needs attention. */
export type PipelineView = {
  openCount: number;
  pipelineCents: number;
  staleLeads: { name: string; days: number }[];
};

/**
 * "Good evening, Nora". The page awaits this for its title: it reads only
 * the org and member, which the app layout already loaded (both cached per
 * request), so it costs nothing.
 */
export async function getGreetingTitle(): Promise<string> {
  const [org, member] = await Promise.all([getCurrentOrg(), getCurrentMember()]);
  const name = member?.first_name;
  return `${greeting(hourIn(org.timezone))}${name ? `, ${name}` : ""}`;
}

/** This month's money and the Snapshot's inputs. Shared by three sections. */
export async function getBusinessView(): Promise<BusinessView> {
  const data = await loadBusiness();
  const scheduleInput = { today: data.today, clients: data.clients, services: data.services, payments: data.payments };
  const rows = scheduleForMonth({ ...scheduleInput, month: data.thisMonth });
  const { personalCents, businessCents } = sumExpenses(data.expenses);
  const topClient = revenueByClient(data.clients, data.services, data.today)[0];

  return {
    totals: scheduleTotals(rows),
    overdue: [...earlierOverdue(data.thisMonth, scheduleInput), ...rows.filter((r) => r.status === "overdue")],
    upcoming: rows.filter((r) => r.status !== "paid"),
    floorCents: data.floorCents,
    clientCount: data.clients.length,
    snapshot: {
      personal: personalCents / 100,
      business: businessCents / 100,
      taxRate: data.org.tax_reserve_rate * 100,
      revenue: data.revenueCents / 100,
      topClientName: topClient?.name,
      topClientMrr: topClient ? topClient.monthlyCents / 100 : undefined,
    },
  };
}

/** Open leads, what they're worth monthly, and which have gone stale. */
export async function getPipelineView(): Promise<PipelineView> {
  const [org, dl] = await Promise.all([getCurrentOrg(), getDataLayer()]);
  const leads = await dl.leads.list();
  const today = todayIso(org.timezone);
  const open = leads.filter((l) => OPEN_STAGES.includes(l.stage));

  return {
    openCount: open.length,
    pipelineCents: open.reduce((t, l) => t + (l.estimated_monthly_cents ?? 0), 0),
    staleLeads: open.filter((l) => isStale(l, today)).map((l) => ({ name: l.name, days: daysInStage(l, today) })),
  };
}
