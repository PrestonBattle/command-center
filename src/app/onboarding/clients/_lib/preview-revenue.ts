import { monthlyCents } from "@/global/lib/billing";
import { dollarsToCents } from "@/global/lib/money";
import type { ClientRowFormValues } from "@/global/lib/schemas/client";

/** Monthly-equivalent revenue of the rows typed so far, in cents, and how many count. */
export function previewRevenue(rows: ClientRowFormValues[]): { count: number; monthlyCents: number } {
  let count = 0;
  let total = 0;
  for (const row of rows) {
    const dollars = Number(String(row.amount).replace(/[$,\s]/g, ""));
    if (!row.name.trim() || !Number.isFinite(dollars) || dollars <= 0) continue;
    count += 1;
    total += monthlyCents({ amount_cents: dollarsToCents(dollars), interval_months: Number(row.interval_months) || 1 });
  }
  return { count, monthlyCents: total };
}
