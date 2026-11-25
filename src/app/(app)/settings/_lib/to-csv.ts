/*
 * Rows → CSV text, by RFC 4180: comma-separated, CRLF line ends, fields
 * with a comma, quote or line break wrapped in quotes (inner quotes doubled).
 */

/** A cell: text, a number, or nothing. */
export type CsvCell = string | number | null | undefined;

/**
 * Text that starts with = + - @ (or a tab / carriage return) is run as a
 * formula by Excel and Sheets. A client named "=HYPERLINK(…)" must stay a
 * name, so such text gets a leading apostrophe. Numbers are left alone, so
 * negative amounts still read as numbers.
 */
function guardFormula(text: string): string {
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

function cell(value: CsvCell): string {
  if (value === null || value === undefined) return "";
  const text = typeof value === "number" ? String(value) : guardFormula(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** A header row plus data rows as one CSV string. */
export function toCsv(headers: string[], rows: CsvCell[][]): string {
  return [headers, ...rows].map((row) => row.map(cell).join(",")).join("\r\n") + "\r\n";
}
