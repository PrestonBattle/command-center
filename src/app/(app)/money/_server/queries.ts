import "server-only";

import { getCurrentOrg } from "@/global/data";
import { scheduleForMonth, scheduleTotals, type ScheduledPayment } from "@/global/lib/billing";
import { monthOf, monthParam, parseMonthParam, todayIso, type YearMonth } from "@/global/lib/dates";
import { earlierOverdue } from "../../_lib/earlier-overdue";
import { loadBusiness } from "../../_lib/load-business";

/** Which month the page shows, and whether it's this one. */
export type MoneyMonth = { month: YearMonth; isCurrent: boolean };

/** Everything the Money page shows for one month. */
export type MoneyView = {
  totals: ReturnType<typeof scheduleTotals>;
  floorCents: number;
  /** This month's scheduled payments. */
  rows: ScheduledPayment[];
  /** Unpaid payments from recent months; only filled in for this month. */
  earlier: ScheduledPayment[];
};

/**
 * Reads ?month= against today in the org's timezone. The page awaits this
 * one: it needs the month for its title and month nav straight away, and
 * the org it reads was already loaded by the app layout (getCurrentOrg is
 * cached per request), so it costs nothing.
 */
export async function getMoneyMonth(param: string | undefined): Promise<MoneyMonth> {
  const org = await getCurrentOrg();
  const thisMonth = monthOf(todayIso(org.timezone));
  const month = parseMonthParam(param, thisMonth);
  return { month, isCurrent: monthParam(month) === monthParam(thisMonth) };
}

/** The month's schedule, its totals, the floor, and (for this month) older unpaid payments. */
export async function getMoneyView({ month, isCurrent }: MoneyMonth): Promise<MoneyView> {
  const data = await loadBusiness();
  const scheduleInput = { today: data.today, clients: data.clients, services: data.services, payments: data.payments };
  const rows = scheduleForMonth({ ...scheduleInput, month });

  return {
    totals: scheduleTotals(rows),
    floorCents: data.floorCents,
    rows,
    earlier: isCurrent ? earlierOverdue(month, scheduleInput) : [],
  };
}
