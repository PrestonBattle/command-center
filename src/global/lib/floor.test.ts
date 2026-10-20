import { describe, expect, it } from "vitest";
import { calculateFloorCents, floorBreakdown, sumExpenses } from "./floor";

describe("calculateFloorCents", () => {
  it("grosses up personal costs for tax, not business costs", () => {
    // $2,700 personal, $850 business, 28% → 850 + 2700/0.72 = $4,600
    expect(calculateFloorCents({ personalCents: 270_000, businessCents: 85_000, taxRate: 0.28 })).toBe(460_000);
  });

  it("is just the costs when the tax rate is 0", () => {
    expect(calculateFloorCents({ personalCents: 100_000, businessCents: 50_000, taxRate: 0 })).toBe(150_000);
  });
});

describe("floorBreakdown", () => {
  it("parts add up to the floor", () => {
    const b = floorBreakdown({ personalCents: 270_000, businessCents: 85_000, taxRate: 0.28 });
    expect(b.taxCents).toBe(105_000);
    expect(b.personalCents + b.businessCents + b.taxCents).toBe(b.floorCents);
  });
});

describe("sumExpenses", () => {
  it("splits by scope", () => {
    expect(
      sumExpenses([
        { scope: "personal", amount_cents: 100 },
        { scope: "business", amount_cents: 40 },
        { scope: "personal", amount_cents: 5 },
      ]),
    ).toEqual({ personalCents: 105, businessCents: 40 });
  });
});
