import { z } from "zod";
import {
  BUSINESS_TYPES,
  DEFAULT_TAX_RESERVE_RATE,
  EXPENSE_CATEGORIES,
  type BusinessTypeKey,
  type ExpenseCategoryKey,
} from "./constants";

/*
 * One schema per onboarding step. The form and the server action share
 * them: the form for instant feedback, the action as the real check.
 *
 * Form data arrives as strings, so number fields use z.coerce. Money is
 * typed in dollars and comes out of these schemas as integer cents, so
 * actions never do unit conversion.
 */

/* ---------- reusable field pieces ---------- */

/** Blank / whitespace-only → undefined, so .optional() and .default() kick in. */
const blankToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

/** Strip "$" and "," so "$1,250.50" parses. */
const cleanMoney = (v: unknown) =>
  typeof v === "string" ? v.replace(/[$,\s]/g, "") : v;

/** Dollars → integer cents. Blank = 0. Caps at $10M/month as a sanity check. */
const money = z.preprocess(
  (v) => blankToUndefined(cleanMoney(v)) ?? 0,
  z.coerce
    .number({ error: "Enter a dollar amount" })
    .min(0, "Can't be negative")
    .max(10_000_000, "That looks too high")
    .transform((dollars) => Math.round(dollars * 100)),
);

/** Same as money, but blank stays undefined (field is truly optional). */
const optionalMoney = z.preprocess(
  (v) => blankToUndefined(cleanMoney(v)),
  z.coerce
    .number({ error: "Enter a dollar amount" })
    .min(0, "Can't be negative")
    .max(10_000_000, "That looks too high")
    .transform((dollars) => Math.round(dollars * 100))
    .optional(),
);

/** Trimmed, required text. */
const requiredText = (max: number) =>
  z.string().trim().min(1, "Required").max(max, `Keep it under ${max} characters`);

/** Optional email: blank → undefined, otherwise must be valid. */
const optionalEmail = z.preprocess(
  blankToUndefined,
  z.email("Enter a valid email").trim().toLowerCase().optional(),
);

/* ---------- step 1: business ---------- */

const businessTypeKeys = BUSINESS_TYPES.map((t) => t.key) as [
  BusinessTypeKey,
  ...BusinessTypeKey[],
];

export const businessSchema = z.object({
  name: requiredText(100),
  business_type: z.enum(businessTypeKeys, { error: "Pick a business type" }),
  /** Prefilled from the browser: Intl.DateTimeFormat().resolvedOptions().timeZone */
  timezone: z.preprocess(blankToUndefined, z.string().default("America/New_York")),
});
export type BusinessInput = z.input<typeof businessSchema>;
export type Business = z.output<typeof businessSchema>;

/* ---------- step 2: floor ---------- */

/** One money field per expense category, built from the constants list. */
const expenseShape = Object.fromEntries(
  EXPENSE_CATEGORIES.map((c) => [c.key, money]),
) as Record<ExpenseCategoryKey, typeof money>;

export const floorSchema = z.object({
  /** { housing: 180000, food: 60000, ... } in cents. Blank fields are 0. */
  expenses: z.object(expenseShape),

  /** User types 28 meaning 28%. Blank → default. Output is a fraction: 0.28. */
  tax_rate: z.preprocess(
    blankToUndefined,
    z.coerce
      .number({ error: "Enter a percentage" })
      .min(0, "Can't be negative")
      .max(60, "That looks too high")
      .optional()
      .transform((pct) => (pct === undefined ? DEFAULT_TAX_RESERVE_RATE : pct / 100)),
  ),

  /** What they bring in per month now. Used until they've added clients. */
  estimated_revenue: optionalMoney,
});
export type FloorInput = z.input<typeof floorSchema>;
export type Floor = z.output<typeof floorSchema>;

/* ---------- step 3: clients (manual entry and CSV share clientRowSchema) ---------- */

export const clientRowSchema = z.object({
  name: requiredText(120),
  email: optionalEmail,
  /** What they pay each billing cycle, in cents. */
  amount: money.refine((cents) => cents > 0, "Must be more than $0"),
  /** 1 = monthly, 3 = quarterly, 12 = yearly. */
  interval_months: z.preprocess(
    blankToUndefined,
    z.coerce
      .number({ error: "Enter a number of months" })
      .int("Whole months only")
      .min(1, "At least 1 month")
      .max(12, "At most 12 months")
      .default(1),
  ),
});
export type ClientRowInput = z.input<typeof clientRowSchema>;
export type ClientRow = z.output<typeof clientRowSchema>;

export const MAX_CLIENT_ROWS = 500;

export const clientsSchema = z.object({
  clients: z
    .array(clientRowSchema)
    .max(MAX_CLIENT_ROWS, `Up to ${MAX_CLIENT_ROWS} clients at a time`),
});
export type Clients = z.output<typeof clientsSchema>; 