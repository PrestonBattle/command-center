import Papa from "papaparse";

/** A parsed CSV: the header row and one object per data row, keyed by header. */
export type ParsedCsv = {
  headers: string[];
  rows: Record<string, string>[];
};

/**
 * Reads a CSV file in the browser. Headers are trimmed; empty lines skipped.
 * Generic on purpose: mapping columns to app fields is each feature's job.
 */
export function parseCsvFile(file: File): Promise<ParsedCsv> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.trim(),
      complete: (result) =>
        resolve({ headers: (result.meta.fields ?? []).filter(Boolean), rows: result.data }),
      error: (err) => reject(err),
    });
  });
}
