import { describe, expect, it } from "vitest";
import { pageHref, paginate, parsePage } from "./paging";

const list = Array.from({ length: 120 }, (_, i) => i + 1);

describe("parsePage", () => {
  it("reads positive whole numbers", () => {
    expect(parsePage("3")).toBe(3);
  });
  it("falls back to 1 for anything else", () => {
    for (const v of [undefined, "", "0", "-2", "1.5", "abc"]) expect(parsePage(v)).toBe(1);
  });
});

describe("paginate", () => {
  it("cuts a middle page", () => {
    const p = paginate(list, 2, 50);
    expect(p.items[0]).toBe(51);
    expect(p.items).toHaveLength(50);
    expect(p).toMatchObject({ page: 2, pageCount: 3, total: 120, from: 51, to: 100 });
  });
  it("the last page is short", () => {
    expect(paginate(list, 3, 50)).toMatchObject({ from: 101, to: 120, pageCount: 3 });
  });
  it("a page past the end shows the last page", () => {
    expect(paginate(list, 9, 50).page).toBe(3);
  });
  it("an empty list is one empty page", () => {
    expect(paginate([], 1, 50)).toMatchObject({ items: [], page: 1, pageCount: 1, total: 0, from: 0, to: 0 });
  });
});

describe("pageHref", () => {
  it("keeps other params and sets the page", () => {
    expect(pageHref("/clients", { q: "maple", status: "active" }, 2)).toBe("/clients?q=maple&status=active&page=2");
  });
  it("page 1 has no page param, and empty params are dropped", () => {
    expect(pageHref("/clients", { q: "", page: "4" }, 1)).toBe("/clients");
  });
});
