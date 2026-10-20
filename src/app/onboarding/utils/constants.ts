import type { ExpenseScope } from "@/global/types/supabase/types";

/* ---------- expense categories (from the Life Vest calculator) ---------- */

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

/* ---------- business types (onboarding step 1) ---------- */

export type BusinessTypeGroup =
  | "Creative & digital"
  | "Professional services"
  | "Health & personal"
  | "Home & trades"
  | "Education & events"
  | "Other";
 
export type BusinessType = {
  /** Stable id, stored in orgs.business_type. Never change once in use. */
  key: string;
  /** Shown to the user. Safe to reword. */
  label: string;
  /** Heading in the grouped select. */
  group: BusinessTypeGroup;
};
 
export const BUSINESS_TYPES = [
  // Creative & digital
  { key: "web_design", group: "Creative & digital", label: "Web design & development" },
  { key: "graphic_design", group: "Creative & digital", label: "Graphic design & branding" },
  { key: "photography", group: "Creative & digital", label: "Photography" },
  { key: "video", group: "Creative & digital", label: "Video & animation" },
  { key: "writing", group: "Creative & digital", label: "Writing & copywriting" },
  { key: "marketing", group: "Creative & digital", label: "Marketing & social media" },
  { key: "software", group: "Creative & digital", label: "Software & IT services" },
 
  // Professional services
  { key: "consulting", group: "Professional services", label: "Consulting" },
  { key: "bookkeeping", group: "Professional services", label: "Bookkeeping & accounting" },
  { key: "legal", group: "Professional services", label: "Legal services" },
  { key: "virtual_assistant", group: "Professional services", label: "Virtual assistant & admin" },
  { key: "real_estate", group: "Professional services", label: "Real estate" },
  { key: "insurance_finance", group: "Professional services", label: "Insurance & financial advice" },
 
  // Health & personal
  { key: "coaching", group: "Health & personal", label: "Coaching" },
  { key: "fitness", group: "Health & personal", label: "Personal training & fitness" },
  { key: "therapy_wellness", group: "Health & personal", label: "Therapy & wellness" },
  { key: "beauty", group: "Health & personal", label: "Hair, beauty & spa" },
  { key: "pet_care", group: "Health & personal", label: "Pet care & grooming" },
 
  // Home & trades
  { key: "trades", group: "Home & trades", label: "Trades (electrical, plumbing, HVAC)" },
  { key: "construction", group: "Home & trades", label: "Construction & remodeling" },
  { key: "cleaning", group: "Home & trades", label: "Cleaning services" },
  { key: "landscaping", group: "Home & trades", label: "Landscaping & lawn care" },
  { key: "auto", group: "Home & trades", label: "Auto repair & detailing" },
 
  // Education & events
  { key: "tutoring", group: "Education & events", label: "Tutoring & lessons" },
  { key: "events", group: "Education & events", label: "Event planning" },
  { key: "catering", group: "Education & events", label: "Catering & personal chef" },
 
  // Other
  { key: "other", group: "Other", label: "Other" },
] as const satisfies readonly BusinessType[];
 
/** "web_design" | "graphic_design" | … | "other" */
export type BusinessTypeKey = (typeof BUSINESS_TYPES)[number]["key"];
 
/** Shape Mantine's <Select data={…}> wants for grouped options. */
export const BUSINESS_TYPE_OPTIONS = Object.entries(
  Object.groupBy(BUSINESS_TYPES, (t) => t.group),
).map(([group, items]) => ({
  group,
  items: (items ?? []).map((t) => ({ value: t.key, label: t.label })),
}));

/* ---------- onboarding steps ---------- */

/** Matches orgs.onboarding_step (1–4). Order here is the order users see. */
export const ONBOARDING_STEPS = [
  { step: 1, path: "/onboarding/business", label: "Your business" },
  { step: 2, path: "/onboarding/floor", label: "Your floor" },
  { step: 3, path: "/onboarding/clients", label: "Your clients" },
  { step: 4, path: "/onboarding/done", label: "Done" },
] as const;

/** Default tax set-aside when the user leaves it blank. */
export const DEFAULT_TAX_RESERVE_RATE = 0.25;