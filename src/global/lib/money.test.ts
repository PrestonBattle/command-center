import { describe, expect, it } from "vitest";
import { dollarsToCents, formatCents } from "./money";

describe("money", () => {
  it("rounds instead of truncating floating point", () => {
    expect(dollarsToCents(19.99)).toBe(1999);
  });

  it("formats whole dollars by default", () => {
    expect(formatCents(460_000)).toBe("$4,600");
    expect(formatCents(125_050, { showCents: true })).toBe("$1,250.50");
  });
});
