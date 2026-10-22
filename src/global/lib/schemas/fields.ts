import { z } from "zod";

/*
 * Field schemas every form shares. Forms send strings (or numbers from
 * NumberInput); these clean and coerce them. Money goes in as dollars and
 * comes out as integer cents, so actions never convert units.
 */

/** Blank or whitespace-only → undefined, so .optional() and .default() apply. */
export const blankToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

/** Strips "$", "," and spaces so "$1,250.50" parses. */
const cleanMoney = (v: unknown) => (typeof v === "string" ? v.replace(/[$,\s]/g, "") : v);

const dollars = z.coerce
  .number({ error: "Enter a dollar amount" })
  .min(0, "Can't be negative")
  .max(10_000_000, "That looks too high");

/** Dollars → integer cents. Blank means $0. */
export const money = z.preprocess(
  (v) => blankToUndefined(cleanMoney(v)) ?? 0,
  dollars.transform((d) => Math.round(d * 100)),
);

/** Dollars → integer cents, or undefined when left blank. */
export const optionalMoney = z.preprocess(
  (v) => blankToUndefined(cleanMoney(v)),
  dollars.transform((d) => Math.round(d * 100)).optional(),
);

/** Dollars → cents, required and above zero. */
export const positiveMoney = money.refine((cents) => cents > 0, "Must be more than $0");

/** Trimmed text, required, with a length cap. */
export const requiredText = (max: number) =>
  z.string().trim().min(1, "Required").max(max, `Keep it under ${max} characters`);

/** Trimmed text, or undefined when blank. */
export const optionalText = (max: number) =>
  z.preprocess(blankToUndefined, z.string().trim().max(max, `Keep it under ${max} characters`).optional());

/** A valid email, lowercased, or undefined when blank. */
export const optionalEmail = z.preprocess(
  blankToUndefined,
  z.email("Enter a valid email").trim().toLowerCase().optional(),
);

/** Months between payments: 1–24, defaulting to monthly. */
export const intervalMonths = z.preprocess(
  blankToUndefined,
  z.coerce
    .number({ error: "Pick how often they pay" })
    .int("Whole months only")
    .min(1, "At least 1 month")
    .max(24, "At most 24 months")
    .default(1),
);

/** A "YYYY-MM-DD" date. */
export const isoDateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date");

/**
 * A phone number stored as digits (a leading + allowed), or undefined when
 * blank. Same rule as signup, so "(904) 555-0100" and "9045550100" are the
 * same number. (Signup keeps its own copy: the auth folder is Preston's.)
 */
export const optionalPhone = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .pipe(z.string().min(10, "Enter a valid phone number").max(16, "Enter a valid phone number").regex(/^\+?\d+$/, "Enter a valid phone number"))
    .optional(),
);
