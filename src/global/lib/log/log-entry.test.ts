import { describe, expect, it } from "vitest";
import { clip, MAX_MESSAGE, toLogEntry } from "./log-entry";

const now = new Date("2026-11-25T12:00:00Z");

describe("toLogEntry", () => {
  it("keeps an Error's name, message, stack and digest", () => {
    const error = Object.assign(new Error("boom"), { digest: "123" });
    const entry = toLogEntry("error", "clients:update", error, { path: "/clients" }, now);
    expect(entry).toMatchObject({ level: "error", time: "2026-11-25T12:00:00.000Z", label: "clients:update", message: "boom", name: "Error", digest: "123", path: "/clients" });
    expect(entry.stack).toContain("boom");
  });

  it("handles strings and plain objects", () => {
    expect(toLogEntry("warn", "x", "odd", {}, now).message).toBe("odd");
    expect(toLogEntry("error", "x", { code: 1 }, {}, now).message).toBe('{"code":1}');
  });

  it("can't be overridden by context", () => {
    expect(toLogEntry("error", "real", new Error("m"), { label: "fake", level: "info" }, now)).toMatchObject({ label: "real", level: "error" });
  });

  it("cuts long messages", () => {
    expect(toLogEntry("error", "x", "a".repeat(MAX_MESSAGE + 50), {}, now).message).toHaveLength(MAX_MESSAGE + 1);
    expect(clip("abc", 5)).toBe("abc");
  });
});
