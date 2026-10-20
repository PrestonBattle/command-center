import type { ClientRowFormValues } from "@/global/lib/schemas/client";

/** The client fields a CSV column can be matched to. */
export const CSV_FIELDS = [
  { key: "name", label: "Client name", required: true, guesses: ["name", "client", "company", "business"] },
  { key: "email", label: "Email", required: false, guesses: ["email", "e-mail", "mail"] },
  { key: "amount", label: "Amount", required: true, guesses: ["amount", "price", "fee", "rate", "retainer", "monthly"] },
  { key: "interval", label: "How often", required: false, guesses: ["interval", "frequency", "billing", "cycle", "every"] },
] as const;

export type CsvFieldKey = (typeof CSV_FIELDS)[number]["key"];

/** Which CSV header each field reads from; "" means not matched. */
export type CsvMapping = Record<CsvFieldKey, string>;

/** Best guess at the mapping from header names, so most files need no clicks. */
export function guessMapping(headers: string[]): CsvMapping {
  const used = new Set<string>();
  const pick = (guesses: readonly string[]) => {
    const match = headers.find((h) => !used.has(h) && guesses.some((g) => h.toLowerCase().includes(g)));
    if (match) used.add(match);
    return match ?? "";
  };
  return Object.fromEntries(CSV_FIELDS.map((f) => [f.key, pick(f.guesses)])) as CsvMapping;
}

/** "quarterly", "3", "every 3 months", "yearly" → "3" etc. Unknown → monthly. */
export function parseInterval(text: string | undefined): string {
  const t = (text ?? "").toLowerCase();
  if (t.includes("quarter")) return "3";
  if (t.includes("year") || t.includes("annual")) return "12";
  if (t.includes("half") || t.includes("semi") || t.includes("6")) return "6";
  const n = parseInt(t.replace(/\D/g, ""), 10);
  return [1, 3, 6, 12].includes(n) ? String(n) : "1";
}

/** CSV rows → form rows, using the mapping. Rows with no name are dropped. */
export function mapCsvRows(rows: Record<string, string>[], mapping: CsvMapping): ClientRowFormValues[] {
  const get = (row: Record<string, string>, key: CsvFieldKey) => (mapping[key] ? (row[mapping[key]] ?? "").trim() : "");
  return rows
    .map((row) => ({
      name: get(row, "name"),
      email: get(row, "email"),
      amount: get(row, "amount").replace(/[$,\s]/g, ""),
      interval_months: parseInterval(get(row, "interval")),
    }))
    .filter((row) => row.name);
}

/** A starter CSV people can download and fill in. */
export const CSV_TEMPLATE =
  "Client name,Email,Amount,How often\nHarbor Dental,office@harbordental.com,2500,Monthly\nRidgeline Law,ap@ridgelinelaw.com,3750,Quarterly\n";
