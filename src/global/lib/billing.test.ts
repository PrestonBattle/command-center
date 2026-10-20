import { describe, expect, it } from "vitest";
import type { ClientServiceRow } from "@/global/types/supabase/types";
import { dueDateInMonth, monthlyCents, monthlyRevenueCents, scheduleForMonth, scheduleTotals } from "./billing";

const service = (over: Partial<ClientServiceRow> = {}): ClientServiceRow => ({
  id: "s1",
  org_id: "o",
  client_id: "c1",
  created_at: "",
  name: "Retainer",
  amount_cents: 300_000,
  interval_months: 1,
  billing_day: null,
  started_on: "2026-01-15",
  ended_on: null,
  ...over,
});

describe("dueDateInMonth", () => {
  it("bills monthly on the start day", () => {
    expect(dueDateInMonth(service(), { year: 2026, month: 3 })).toBe("2026-03-15");
  });

  it("skips months between quarterly payments", () => {
    const q = service({ interval_months: 3 });
    expect(dueDateInMonth(q, { year: 2026, month: 4 })).toBe("2026-04-15");
    expect(dueDateInMonth(q, { year: 2026, month: 5 })).toBeNull();
  });

  it("is never due before it starts or after it ends", () => {
    expect(dueDateInMonth(service(), { year: 2025, month: 12 })).toBeNull();
    expect(dueDateInMonth(service({ ended_on: "2026-03-10" }), { year: 2026, month: 3 })).toBeNull();
  });

  it("moves a billing day past month end to the last day", () => {
    expect(dueDateInMonth(service({ billing_day: 31 }), { year: 2026, month: 2 })).toBe("2026-02-28");
  });
});

describe("monthlyCents and revenue", () => {
  it("spreads longer intervals over months", () => {
    expect(monthlyCents({ amount_cents: 300_000, interval_months: 3 })).toBe(100_000);
  });

  it("only counts billable clients", () => {
    const clients = [
      { id: "c1", status: "active" as const },
      { id: "c2", status: "paused" as const },
    ];
    const services = [service(), service({ id: "s2", client_id: "c2" })];
    expect(monthlyRevenueCents(clients, services, "2026-03-01")).toBe(300_000);
  });
});

describe("scheduleForMonth", () => {
  const clients = [{ id: "c1", name: "Harbor Dental", status: "active" as const }];

  it("marks paid, overdue and upcoming", () => {
    const services = [service(), service({ id: "s2", billing_day: 28, amount_cents: 50_000 })];
    const payments = [
      { id: "p1", org_id: "o", client_id: "c1", service_id: "s1", created_at: "", amount_cents: 300_000, due_on: "2026-03-15", paid_on: "2026-03-16" },
    ];
    const rows = scheduleForMonth({ month: { year: 2026, month: 3 }, today: "2026-03-20", clients, services, payments });
    expect(rows.map((r) => r.status)).toEqual(["paid", "upcoming"]);
    expect(scheduleTotals(rows)).toEqual({ expectedCents: 350_000, paidCents: 300_000, overdueCents: 0, remainingCents: 50_000 });

    const later = scheduleForMonth({ month: { year: 2026, month: 3 }, today: "2026-03-30", clients, services, payments: [] });
    expect(later.map((r) => r.status)).toEqual(["overdue", "overdue"]);
  });
});
