import { describe, expect, it } from "vitest";
import { attentionItems } from "./attention";

describe("attentionItems", () => {
  it("is empty when everything is fine", () => {
    expect(attentionItems({ overdue: [], staleLeads: [], floorCents: 100, clientCount: 2 })).toEqual([]);
  });

  it("lists overdue first, then stale leads, then setup gaps", () => {
    const items = attentionItems({
      overdue: [{ key: "s:2026-10-01", clientId: "c", clientName: "Maple", serviceId: "s", serviceName: "x", amountCents: 150_000, dueOn: "2026-10-01", status: "overdue", paymentId: null, paidOn: null }],
      staleLeads: [{ name: "Granite CPA", days: 20 }],
      floorCents: 0,
      clientCount: 1,
    });
    expect(items.map((i) => i.tone)).toEqual(["bad", "warn", "warn"]);
    expect(items[0].title).toBe("Maple owes $1,500");
  });
});
