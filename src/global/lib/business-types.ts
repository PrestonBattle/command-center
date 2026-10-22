/*
 * The business types a person picks from (onboarding step 1 and Settings).
 * Moved out of onboarding once Settings needed them too.
 */

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
