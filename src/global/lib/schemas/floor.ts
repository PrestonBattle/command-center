import { z } from "zod";
import {
  DEFAULT_TAX_RESERVE_RATE,
  EXPENSE_CATEGORIES,
  type ExpenseCategoryKey,
} from "@/global/lib/expense-categories";
import { blankToUndefined, money, optionalMoney } from "./fields";

/** One money field per expense category, built from the category list. */
const expenseShape = Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c.key, money])) as Record<
  ExpenseCategoryKey,
  typeof money
>;

/**
 * The floor form: monthly expenses by category, the tax set-aside and an
 * optional current-revenue estimate. Used by onboarding step 2 and the Life
 * vest page.
 */
export const floorSchema = z.object({
  /** { housing: 180000, … } in cents. Blank fields are 0. */
  expenses: z.object(expenseShape),
  /** Typed as a percent (28). Blank → the default. Output is a fraction (0.28). */
  tax_rate: z.preprocess(
    blankToUndefined,
    z.coerce
      .number({ error: "Enter a percentage" })
      .min(0, "Can't be negative")
      .max(60, "That looks too high")
      .optional()
      .transform((pct) => (pct === undefined ? DEFAULT_TAX_RESERVE_RATE : pct / 100)),
  ),
  /** What they bring in per month now, used until clients are added. */
  estimated_revenue: optionalMoney,
});

export type FloorInput = z.input<typeof floorSchema>;
export type Floor = z.output<typeof floorSchema>;

/** Form values for the floor form: dollars and a percent, as the inputs hold them. */
export type FloorFormValues = {
  expenses: Record<ExpenseCategoryKey, number | string>;
  tax_rate: number | string;
  estimated_revenue: number | string;
};
