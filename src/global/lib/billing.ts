import type { ClientRow, ClientServiceRow, PaymentRow } from "@/global/types/supabase/types";
import { daysInMonth, isoDate, monthOf, monthsBetween, parseIso, type YearMonth } from "./dates";

/*
 * When money is expected, worked out from client_services on the fly.
 *
 * A service bills every `interval_months`, counting from the month it
 * started, on `billing_day` (or the start date's day). Expected payments are
 * never stored: only a payment someone marks as received becomes a
 * `payments` row. That keeps the schedule correct when a service's amount or
 * interval changes, with nothing to regenerate.
 */

/** Client statuses that count toward revenue. Paused and ended don't. */
export const BILLABLE_STATUSES: ClientRow["status"][] = ["active", "onboarding"];

/** The monthly equivalent of a service: $3,000 quarterly → $1,000/mo. */
export function monthlyCents(service: Pick<ClientServiceRow, "amount_cents" | "interval_months">): number {
  return Math.round(service.amount_cents / Math.max(service.interval_months, 1));
}

/**
 * The date a service is due in a given month, or null if it isn't due then.
 * A billing day past the month's end (31 in February) falls on the last day.
 */
export function dueDateInMonth(service: ClientServiceRow, month: YearMonth): string | null {
  const start = parseIso(service.started_on);
  const since = monthsBetween(monthOf(service.started_on), month);
  if (since < 0 || since % Math.max(service.interval_months, 1) !== 0) return null;

  const day = Math.min(service.billing_day ?? start.day, daysInMonth(month));
  const due = isoDate(month.year, month.month, day);
  if (service.ended_on && due > service.ended_on) return null;
  return due;
}

/** Whether a service is running on a date (started, not yet ended). */
export function isServiceActive(service: ClientServiceRow, onDate: string): boolean {
  return service.started_on <= onDate && (!service.ended_on || service.ended_on >= onDate);
}

/** Monthly-equivalent revenue in cents from billable clients' active services. */
export function monthlyRevenueCents(
  clients: Pick<ClientRow, "id" | "status">[],
  services: ClientServiceRow[],
  onDate: string,
): number {
  const billable = new Set(clients.filter((c) => BILLABLE_STATUSES.includes(c.status)).map((c) => c.id));
  return services
    .filter((s) => billable.has(s.client_id) && isServiceActive(s, onDate))
    .reduce((sum, s) => sum + monthlyCents(s), 0);
}

/** Monthly revenue per billable client, biggest first. */
export function revenueByClient(
  clients: Pick<ClientRow, "id" | "name" | "status">[],
  services: ClientServiceRow[],
  onDate: string,
): { id: string; name: string; monthlyCents: number }[] {
  return clients
    .filter((c) => BILLABLE_STATUSES.includes(c.status))
    .map((c) => ({
      id: c.id,
      name: c.name,
      monthlyCents: services
        .filter((s) => s.client_id === c.id && isServiceActive(s, onDate))
        .reduce((t, s) => t + monthlyCents(s), 0),
    }))
    .filter((c) => c.monthlyCents > 0)
    .sort((a, b) => b.monthlyCents - a.monthlyCents);
}

/** Where a payment stands. */
export type PaymentStatus = "paid" | "overdue" | "due" | "upcoming";

/** One line on the Money page: an expected payment and what happened to it. */
export type ScheduledPayment = {
  key: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  amountCents: number;
  dueOn: string;
  status: PaymentStatus;
  /** The payments row, once it's been marked paid. */
  paymentId: string | null;
  paidOn: string | null;
};

/**
 * Every payment expected in a month from billable clients, matched against
 * recorded payments by (service, due date), sorted by due date.
 */
export function scheduleForMonth(input: {
  month: YearMonth;
  today: string;
  clients: Pick<ClientRow, "id" | "name" | "status">[];
  services: ClientServiceRow[];
  payments: PaymentRow[];
}): ScheduledPayment[] {
  const { month, today, clients, services, payments } = input;
  const clientsById = new Map(clients.map((c) => [c.id, c]));
  const paid = new Map(payments.filter((p) => p.service_id).map((p) => [`${p.service_id}:${p.due_on}`, p]));

  const rows: ScheduledPayment[] = [];
  for (const service of services) {
    const client = clientsById.get(service.client_id);
    if (!client || !BILLABLE_STATUSES.includes(client.status)) continue;
    const dueOn = dueDateInMonth(service, month);
    if (!dueOn) continue;

    const key = `${service.id}:${dueOn}`;
    const payment = paid.get(key);
    rows.push({
      key,
      clientId: client.id,
      clientName: client.name,
      serviceId: service.id,
      serviceName: service.name,
      amountCents: service.amount_cents,
      dueOn,
      status: payment?.paid_on ? "paid" : dueOn < today ? "overdue" : dueOn === today ? "due" : "upcoming",
      paymentId: payment?.id ?? null,
      paidOn: payment?.paid_on ?? null,
    });
  }
  return rows.sort((a, b) => a.dueOn.localeCompare(b.dueOn) || a.clientName.localeCompare(b.clientName));
}

/** Totals for a month's schedule, in cents. */
export function scheduleTotals(rows: ScheduledPayment[]) {
  const sum = (status?: PaymentStatus) =>
    rows.filter((r) => !status || r.status === status).reduce((t, r) => t + r.amountCents, 0);
  return {
    expectedCents: sum(),
    paidCents: sum("paid"),
    overdueCents: sum("overdue"),
    remainingCents: sum("due") + sum("upcoming"),
  };
}
