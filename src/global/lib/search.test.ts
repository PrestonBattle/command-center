import { describe, expect, it } from "vitest";
import { matchesQuery } from "./search";

describe("matchesQuery", () => {
  const acme = ["Acme Dental", "Dana Ruiz", "hi@acme.test", "(904) 555-0199"];

  it("matches everything when the query is blank", () => {
    expect(matchesQuery("  ", acme)).toBe(true);
  });

  it("is case-insensitive and trims", () => {
    expect(matchesQuery("  aCmE ", acme)).toBe(true);
    expect(matchesQuery("dana", acme)).toBe(true);
  });

  it("matches phone numbers however they're typed", () => {
    expect(matchesQuery("9045550199", acme)).toBe(true);
    expect(matchesQuery("555-0199", acme)).toBe(true);
  });

  it("doesn't digit-match on very short numbers", () => {
    // "9-0" isn't in the text, and two digits would digit-match far too much.
    expect(matchesQuery("9-0", ["Birch Yoga", null, "(904) 555-0100"])).toBe(false);
  });

  it("ignores missing fields", () => {
    expect(matchesQuery("birch", [null, undefined, "Birch Yoga"])).toBe(true);
    expect(matchesQuery("zzz", [null, undefined])).toBe(false);
  });
});
