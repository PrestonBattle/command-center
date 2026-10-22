import { describe, expect, it } from "vitest";
import { timezoneOptions, utcOffsetLabel } from "./timezones";

describe("utcOffsetLabel", () => {
  it("follows daylight saving", () => {
    expect(utcOffsetLabel("America/New_York", new Date("2026-07-01T12:00:00Z"))).toBe("GMT-4");
    expect(utcOffsetLabel("America/New_York", new Date("2026-01-15T12:00:00Z"))).toBe("GMT-5");
  });
});

describe("timezoneOptions", () => {
  const groups = timezoneOptions(new Date("2026-07-01T12:00:00Z"));
  const all = groups.flatMap((g) => g.items);

  it("groups by region", () => {
    expect(groups.map((g) => g.group)).toEqual(expect.arrayContaining(["America", "Europe", "Asia"]));
  });
  it("labels places readably, with the offset", () => {
    expect(all.find((o) => o.value === "America/New_York")?.label).toBe("New York (GMT-4)");
    expect(all.find((o) => o.value === "America/Indiana/Knox")?.label).toBe("Indiana · Knox (GMT-5)");
  });
  it("includes a saved zone this runtime lists under another name", () => {
    const withAlias = timezoneOptions(new Date("2026-07-01T12:00:00Z"), "America/Argentina/Buenos_Aires").flatMap((g) => g.items);
    expect(withAlias.find((o) => o.value === "America/Argentina/Buenos_Aires")?.label).toBe("Argentina · Buenos Aires (GMT-3)");
  });
  it("lists each zone once", () => {
    expect(new Set(all.map((o) => o.value)).size).toBe(all.length);
  });
});
