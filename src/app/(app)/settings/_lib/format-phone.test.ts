import { describe, expect, it } from "vitest";
import { formatPhone } from "./format-phone";

describe("formatPhone", () => {
  it("formats 10-digit US numbers", () => {
    expect(formatPhone("9045550100")).toBe("(904) 555-0100");
    expect(formatPhone("+19045550100")).toBe("(904) 555-0100");
  });
  it("leaves anything else as stored", () => {
    expect(formatPhone("+447700900123")).toBe("+447700900123");
    expect(formatPhone("")).toBe("");
  });
});
