import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, toThemeId } from "./themes";

describe("toThemeId", () => {
  it("keeps a known theme", () => {
    expect(toThemeId("harbor-night")).toBe("harbor-night");
  });

  it("falls back to the default for anything else", () => {
    expect(toThemeId(undefined)).toBe(DEFAULT_THEME);
    expect(toThemeId("purple")).toBe(DEFAULT_THEME);
    // Sunset was removed; people who picked it land on the default.
    expect(toThemeId("sunset")).toBe(DEFAULT_THEME);
    expect(toThemeId("")).toBe(DEFAULT_THEME);
  });
});
