import {
  DEFAULT_TAX_RESERVE_RATE,
  EXPENSE_CATEGORIES,
  type ExpenseCategoryKey,
} from "@/global/lib/expense-categories";
import { calculateFloorCents, floorBreakdown, type FloorBreakdown } from "@/global/lib/floor";
import { centsToDollars, dollarsToCents } from "@/global/lib/money";
import type { FloorFormValues } from "@/global/lib/schemas/floor";
import type { ExpenseRow, OrgRow } from "@/global/types/supabase/types";

/*
 * Converting between saved floor data (cents, a fraction) and the floor
 * form (dollars, a percent), plus a live preview while typing.
 */

/** Form values from saved expense rows and the org. Missing categories start blank. */
export function toFloorFormValues(
  expenses: Pick<ExpenseRow, "category" | "amount_cents">[],
  org: Pick<OrgRow, "tax_reserve_rate" | "estimated_revenue_cents">,
): FloorFormValues {
  const byCategory = new Map(expenses.map((e) => [e.category, e.amount_cents]));
  const values = Object.fromEntries(
    EXPENSE_CATEGORIES.map((c) => {
      const cents = byCategory.get(c.key);
      return [c.key, cents ? centsToDollars(cents) : ""];
    }),
  ) as Record<ExpenseCategoryKey, number | string>;

  return {
    expenses: values,
    tax_rate: Math.round(org.tax_reserve_rate * 1000) / 10,
    estimated_revenue: org.estimated_revenue_cents ? centsToDollars(org.estimated_revenue_cents) : "",
  };
}

/** A typed value as dollars; anything blank or unparseable counts as 0. */
function asDollars(value: number | string): number {
  const n = typeof value === "number" ? value : Number(String(value).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** The floor for what's typed so far, recalculated on every keystroke. */
export function previewFloor(values: FloorFormValues): FloorBreakdown {
  let personalCents = 0;
  let businessCents = 0;
  for (const c of EXPENSE_CATEGORIES) {
    const cents = dollarsToCents(asDollars(values.expenses[c.key]));
    if (c.scope === "personal") personalCents += cents;
    else businessCents += cents;
  }
  const pct = values.tax_rate === "" ? DEFAULT_TAX_RESERVE_RATE * 100 : asDollars(values.tax_rate);
  return floorBreakdown({ personalCents, businessCents, taxRate: pct / 100 });
}

/** Floor in cents from saved data (no form involved). */
export function floorFromSaved(
  expenses: Pick<ExpenseRow, "scope" | "amount_cents">[],
  taxRate: number,
): number {
  let personalCents = 0;
  let businessCents = 0;
  for (const e of expenses) {
    if (e.scope === "personal") personalCents += e.amount_cents;
    else businessCents += e.amount_cents;
  }
  return calculateFloorCents({ personalCents, businessCents, taxRate });
}
