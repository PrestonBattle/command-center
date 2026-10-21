import { describe, expect, it } from "vitest";
import type { ScheduledPayment } from "@/global/lib/billing";
import { attentionItems } from "./attention";

function owed(clientId: string, clientName: string, dueOn: string, amountCents: number): ScheduledPayment {
  return { key: `${clientId}:${dueOn}`, clientId, clientName, serviceId: `${clientId}-s`, serviceName: "Retainer", amountCents, dueOn, status: "overdue", paymentId: null, paidOn: null };
}

const FINE = { overdue: [], staleLeads: [], floorCents: 100, clientCount: 2 };

describe("attentionItems", () => {
  it("is empty when everything is fine", () => {
    expect(attentionItems(FINE)).toEqual([]);
  });

  it("puts setup gaps first, then money owed, then stale leads", () => {
    const items = attentionItems({
      overdue: [owed("m", "Maple", "2026-10-01", 150_000)],
      staleLeads: [{ name: "Granite CPA", days: 20 }],
      floorCents: 0,
      clientCount: 1,
    });
    expect(items.map((i) => i.id)).toEqual(["no-floor", "overdue-m", "stale-leads"]);
    expect(items[1].title).toBe("Maple owes $1,500");
    expect(items[1].detail).toBe("Was due Oct 1");
    expect(items[2].title).toBe("Granite CPA hasn't moved in 20 days");
  });

  it("groups a client's overdue payments into one line, oldest debt first", () => {
    const items = attentionItems({
      ...FINE,
      overdue: [
        owed("h", "Harbor Dental", "2026-09-05", 250_000),
        owed("c", "Cedar Yoga", "2026-08-28", 90_000),
        owed("h", "Harbor Dental", "2026-10-05", 250_000),
        owed("c", "Cedar Yoga", "2026-09-28", 90_000),
      ],
    });
    expect(items.map((i) => i.title)).toEqual(["Cedar Yoga owes $1,800", "Harbor Dental owes $5,000"]);
    expect(items[1].detail).toBe("2 payments · oldest due Sep 5");
  });

  it("collapses many stale leads into one line", () => {
    const items = attentionItems({
      ...FINE,
      staleLeads: [{ name: "A", days: 15 }, { name: "B", days: 30 }, { name: "C", days: 21 }],
    });
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("3 leads haven't moved in 14+ days");
    expect(items[0].detail).toBe("Longest: 30 days · follow up or mark them lost");
  });
});
