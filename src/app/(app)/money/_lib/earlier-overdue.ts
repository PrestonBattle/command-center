import { scheduleForMonth, type ScheduledPayment } from "@/global/lib/billing";
import { addMonths, type YearMonth } from "@/global/lib/dates";

/** How many months back to look for payments that were never marked paid. */
export const OVERDUE_LOOKBACK_MONTHS = 3;

/**
 * Unpaid payments from the months before `month`, oldest first. Without
 * this, something missed last month would vanish when the month changes.
 */
export function earlierOverdue(
  month: YearMonth,
  data: Omit<Parameters<typeof scheduleForMonth>[0], "month">,
): ScheduledPayment[] {
  const rows: ScheduledPayment[] = [];
  for (let back = OVERDUE_LOOKBACK_MONTHS; back >= 1; back--) {
    rows.push(...scheduleForMonth({ ...data, month: addMonths(month, -back) }).filter((r) => r.status === "overdue"));
  }
  return rows;
}
