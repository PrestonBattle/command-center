import type { ExpenseScope } from "@/global/types/supabase/types";

/*
 * Monthly expense categories, from the Life Vest calculator. Onboarding and
 * the Life vest page both use them; `key` is stored in expenses.category.
 */

export type ExpenseCategory = {
  /** Stable id, stored in expenses.category. Never change once in use. */
  key: string;
  scope: ExpenseScope;
  /** Shown to the user. Safe to reword. */
  label: string;
  /** Helper text under the field. */
  hint: string;
};

export const EXPENSE_CATEGORIES = [
  // Personal
  { key: "housing", scope: "personal", label: "Housing", hint: "Mortgage or rent + utilities" },
  { key: "food", scope: "personal", label: "Food & Groceries", hint: "All meals, household supplies" },
  { key: "transportation", scope: "personal", label: "Transportation", hint: "Car payment, gas, insurance, or transit" },
  { key: "health", scope: "personal", label: "Health Insurance & Medical", hint: "Premiums, prescriptions, regular care" },
  { key: "debt", scope: "personal", label: "Debt Payments", hint: "Student loans, credit cards, personal loans" },
  { key: "subscriptions", scope: "personal", label: "Subscriptions & Services", hint: "Streaming, gym, phone, internet" },
  { key: "family", scope: "personal", label: "Family & Dependents", hint: "Childcare, school, support payments" },
  { key: "savings", scope: "personal", label: "Savings Contributions", hint: "Emergency fund, retirement, planned savings — treat this as non-negotiable" },
  { key: "other_personal", scope: "personal", label: "Other Personal Expenses", hint: "Anything not covered above" },

  // Business
  { key: "software", scope: "business", label: "Software & Tools", hint: "CRM, scheduling, design, email platform" },
  { key: "team", scope: "business", label: "Team & Contractors", hint: "VA, bookkeeper, anyone you pay" },
  { key: "marketing", scope: "business", label: "Marketing & Advertising", hint: "Ads, content tools, paid promotion" },
  { key: "development", scope: "business", label: "Professional Development", hint: "Your own coaching, courses, masterminds" },
  { key: "office", scope: "business", label: "Office & Workspace", hint: "Rent, coworking, home office costs" },
  { key: "other_business", scope: "business", label: "Other Business Expenses", hint: "Legal, accounting, banking fees, misc." },
] as const satisfies readonly ExpenseCategory[];

/** Every valid key: "housing" | "food" | … | "other_business" */
export type ExpenseCategoryKey = (typeof EXPENSE_CATEGORIES)[number]["key"];

export const PERSONAL_CATEGORIES = EXPENSE_CATEGORIES.filter((c) => c.scope === "personal");
export const BUSINESS_CATEGORIES = EXPENSE_CATEGORIES.filter((c) => c.scope === "business");

/** Default tax set-aside when the user leaves it blank: 25%. */
export const DEFAULT_TAX_RESERVE_RATE = 0.25;
