import { describe, expect, it } from "vitest";
import { coverageDate, waterlineState } from "./waterline-state";

describe("waterlineState", () => {
  it("puts each coverage in the right band, edges included", () => {
    expect(waterlineState(0)).toBe("under");
    expect(waterlineState(0.89)).toBe("under");
    expect(waterlineState(0.9)).toBe("treading");
    expect(waterlineState(0.99)).toBe("treading");
    expect(waterlineState(1)).toBe("afloat");
    expect(waterlineState(1.15)).toBe("clear");
  });
});

describe("coverageDate", () => {
  const april = new Date(2026, 3, 10); // 30 days

  it("says the whole month when covered", () => {
    expect(coverageDate(1, april)).toBe("All month");
  });

  it("turns half coverage into mid-month", () => {
    expect(coverageDate(0.5, april)).toBe("Apr 15");
  });

  it("never returns a day before the 1st", () => {
    expect(coverageDate(0, april)).toBe("Apr 1");
  });
});
