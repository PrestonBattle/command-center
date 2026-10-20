/*
 * The Life Vest floor: the revenue a business needs each month to cover the
 * owner's life, the business and the taxes on what the owner takes home.
 *
 *   floor = business + personal / (1 − taxRate)
 *
 * Personal spending is grossed up for tax (you pay personal costs from
 * after-tax money); business costs aren't. Matches the SQL function
 * org_floor_cents() so the dashboard and the database always agree.
 */

/** Inputs to the floor, all in cents except the rate. */
export type FloorInputs = {
  personalCents: number;
  businessCents: number;
  /** Fraction set aside for tax: 0.28 means 28%. Must be below 1. */
  taxRate: number;
};

/** The floor and its three parts, all in cents. Parts always add up to the floor. */
export type FloorBreakdown = {
  personalCents: number;
  businessCents: number;
  taxCents: number;
  floorCents: number;
};

/** Monthly floor in cents. */
export function calculateFloorCents({ personalCents, businessCents, taxRate }: FloorInputs): number {
  const rate = Math.min(Math.max(taxRate, 0), 0.99);
  return businessCents + Math.round(personalCents / (1 - rate));
}

/** The floor split into personal, tax and business, for display. */
export function floorBreakdown(inputs: FloorInputs): FloorBreakdown {
  const floorCents = calculateFloorCents(inputs);
  return {
    personalCents: inputs.personalCents,
    businessCents: inputs.businessCents,
    taxCents: floorCents - inputs.personalCents - inputs.businessCents,
    floorCents,
  };
}

/** Sums expense rows by scope. */
export function sumExpenses(
  expenses: { scope: "personal" | "business"; amount_cents: number }[],
): { personalCents: number; businessCents: number } {
  let personalCents = 0;
  let businessCents = 0;
  for (const e of expenses) {
    if (e.scope === "personal") personalCents += e.amount_cents;
    else businessCents += e.amount_cents;
  }
  return { personalCents, businessCents };
}
