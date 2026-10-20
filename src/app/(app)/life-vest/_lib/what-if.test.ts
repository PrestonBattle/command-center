import { describe, expect, it } from "vitest";
import { applyWhatIf, coveragePercent } from "./what-if";

const base = { revenueCents: 525_000, personalCents: 270_000, businessCents: 85_000, taxRate: 0.28 };

describe("applyWhatIf", () => {
  it("does nothing with no changes", () => {
    expect(applyWhatIf({ ...base, lostCents: 0, gainedCents: 0, personalChangeCents: 0 })).toEqual({
      revenueCents: 525_000,
      floorCents: 460_000,
      gapCents: 65_000,
    });
  });

  it("losing a client and a rent rise can put you under", () => {
    const r = applyWhatIf({ ...base, lostCents: 250_000, gainedCents: 0, personalChangeCents: 20_000 });
    expect(r.floorCents).toBe(487_778);
    expect(r.gapCents).toBeLessThan(0);
  });
});

describe("coveragePercent", () => {
  it("rounds and handles no floor", () => {
    expect(coveragePercent(525_000, 460_000)).toBe(114);
    expect(coveragePercent(100, 0)).toBe(0);
  });
});
