import "server-only";

import type { DataLayer } from "@/global/data";
import { EXPENSE_CATEGORIES } from "@/global/lib/expense-categories";
import type { Floor } from "@/global/lib/schemas/floor";

/**
 * Writes a validated floor form: one expense row per category (zeros
 * included, so saving again overwrites cleanly), plus the org's tax rate and
 * revenue estimate. Shared by onboarding step 2 and the Life vest page.
 * Throws DbError; call it inside attempt().
 */
export async function saveFloorData(
  dl: DataLayer,
  floor: Floor,
  extra: { onboarding_step?: number } = {},
): Promise<void> {
  await dl.expenses.upsert(
    EXPENSE_CATEGORIES.map((c) => ({
      scope: c.scope,
      category: c.key,
      label: c.label,
      amount_cents: floor.expenses[c.key],
    })),
    "org_id,category",
  );
  await dl.org.update({
    tax_reserve_rate: floor.tax_rate,
    estimated_revenue_cents: floor.estimated_revenue ?? null,
    ...extra,
  });
}
