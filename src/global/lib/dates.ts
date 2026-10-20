/*
 * Dates as "YYYY-MM-DD" strings, the same shape Postgres `date` columns use.
 * Working in strings avoids timezone drift: a due date is a calendar day,
 * not an instant.
 */

/** A calendar month. `month` is 1–12. */
export type YearMonth = { year: number; month: number };

/** Pads to two digits: 3 → "03". */
const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" for a year, month (1–12) and day. */
export function isoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** Today as "YYYY-MM-DD" in a timezone (defaults to the server's). */
export function todayIso(timeZone?: string): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

/** Splits "YYYY-MM-DD" into numbers. */
export function parseIso(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

/** Number of days in a month (month 1–12). */
export function daysInMonth({ year, month }: YearMonth): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** The month a date falls in. */
export function monthOf(date: string): YearMonth {
  const { year, month } = parseIso(date);
  return { year, month };
}

/** Moves a month forward (or back, with a negative count). */
export function addMonths({ year, month }: YearMonth, count: number): YearMonth {
  const index = year * 12 + (month - 1) + count;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** Whole months from `from` to `to`; negative if `to` is earlier. */
export function monthsBetween(from: YearMonth, to: YearMonth): number {
  return to.year * 12 + to.month - (from.year * 12 + from.month);
}

/** "2026-10" for URLs; parseMonthParam reads it back. */
export function monthParam({ year, month }: YearMonth): string {
  return `${year}-${pad(month)}`;
}

/** Reads "YYYY-MM" from a URL, falling back when missing or malformed. */
export function parseMonthParam(value: string | undefined, fallback: YearMonth): YearMonth {
  const match = value?.match(/^(\d{4})-(\d{2})$/);
  if (!match) return fallback;
  const month = Number(match[2]);
  return month >= 1 && month <= 12 ? { year: Number(match[1]), month } : fallback;
}

/** "October 2026". */
export function formatMonth({ year, month }: YearMonth): string {
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "Oct 5". */
export function formatShortDate(date: string): string {
  const { year, month, day } = parseIso(date);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Whole days from `from` to `to` ("YYYY-MM-DD"); negative if `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  const a = parseIso(from);
  const b = parseIso(to);
  const ms = Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day);
  return Math.round(ms / 86_400_000);
}
