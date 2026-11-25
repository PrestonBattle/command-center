import { describe, expect, it } from "vitest";
import { toCsv } from "./to-csv";

describe("toCsv", () => {
  it("writes a header and rows with CRLF line ends", () => {
    expect(toCsv(["a", "b"], [["x", 1]])).toBe("a,b\r\nx,1\r\n");
  });

  it("quotes commas, quotes and line breaks", () => {
    expect(toCsv(["n"], [['Smith, "Jo"'], ["two\nlines"]])).toBe('n\r\n"Smith, ""Jo"""\r\n"two\nlines"\r\n');
  });

  it("leaves blanks empty", () => {
    expect(toCsv(["a", "b", "c"], [[null, undefined, ""]])).toBe("a,b,c\r\n,,\r\n");
  });

  it("stops text being read as a formula, but keeps negative numbers", () => {
    expect(toCsv(["n"], [["=SUM(A1)"], ["+1"], ["@x"], [-5]])).toBe("n\r\n'=SUM(A1)\r\n'+1\r\n'@x\r\n-5\r\n");
  });
});
