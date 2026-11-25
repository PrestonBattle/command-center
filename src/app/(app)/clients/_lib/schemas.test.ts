import { describe, expect, it } from "vitest";
import { clientDetailsSchema } from "./schemas";

const base = { clientId: "6f1c1c2e-7a4b-4c55-9d0e-2b1f3a4c5d6e", name: "Acme", website: "", signed_on: "2026-01-15", notes: "" };

describe("clientDetailsSchema", () => {
  it("treats blank website and notes as none", () => {
    const out = clientDetailsSchema.parse(base);
    expect(out.website).toBeUndefined();
    expect(out.notes).toBeUndefined();
  });

  it("adds https:// to a bare domain and keeps an existing scheme", () => {
    expect(clientDetailsSchema.parse({ ...base, website: "acme.com" }).website).toBe("https://acme.com");
    expect(clientDetailsSchema.parse({ ...base, website: "http://acme.com/x" }).website).toBe("http://acme.com/x");
  });

  it("rejects things that aren't web addresses", () => {
    expect(clientDetailsSchema.safeParse({ ...base, website: "not a site" }).success).toBe(false);
    expect(clientDetailsSchema.safeParse({ ...base, website: "javascript:alert(1)" }).success).toBe(false);
  });

  it("requires a name and a date", () => {
    expect(clientDetailsSchema.safeParse({ ...base, name: " " }).success).toBe(false);
    expect(clientDetailsSchema.safeParse({ ...base, signed_on: "" }).success).toBe(false);
  });
});
