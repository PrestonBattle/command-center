import { describe, expect, it } from "vitest";
import { guessMapping, mapCsvRows, parseInterval } from "./csv-columns";

describe("csv columns", () => {
  it("guesses common header names", () => {
    expect(guessMapping(["Company", "E-mail", "Monthly fee", "Billing"])).toEqual({
      name: "Company",
      email: "E-mail",
      amount: "Monthly fee",
      interval: "Billing",
    });
  });

  it("reads intervals in words or numbers", () => {
    expect(parseInterval("Quarterly")).toBe("3");
    expect(parseInterval("every 12 months")).toBe("12");
    expect(parseInterval("")).toBe("1");
  });

  it("maps rows and drops nameless ones", () => {
    const rows = mapCsvRows(
      [{ N: "Harbor", A: "$2,500" }, { N: "", A: "10" }],
      { name: "N", email: "", amount: "A", interval: "" },
    );
    expect(rows).toEqual([{ name: "Harbor", email: "", amount: "2500", interval_months: "1" }]);
  });
});
