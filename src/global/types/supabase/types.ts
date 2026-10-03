// All v1 database row types — mirrors command-center-schema.sql.
// Nullable columns are `T | null` (Postgres returns null, never undefined).
// Long-term: replace with `supabase gen types` so these can't drift.

/* ---------- shared literal unions (match the SQL check constraints) ---------- */

export type MemberRole = "owner";
export type ExpenseScope = "personal" | "business";
export type ClientStatus = "active" | "onboarding" | "paused" | "ended";
export type LeadStage = "new" | "contacted" | "proposal" | "won" | "lost";
export type SourceChannel = "referral" | "ppc" | "email" | "event" | "social" | "other";
export type ActivityKind = "note" | "call" | "email" | "payment" | "stage_change";
export type FileKind = "upload" | "link";

/* ---------- tenancy ---------- */

/** A business. One per subscriber; everything else belongs to one. */
export interface OrgRow {
  id: string;
  created_at: string;
  name: string;
  business_type: string | null;
  currency: string;
  timezone: string;
  /** 0.25 = 25% of revenue set aside for taxes. */
  tax_reserve_rate: number;
  /** 1–4. Where onboarding resumes. */
  onboarding_step: number;
  /** Null until onboarding is finished. */
  onboarding_completed_at: string | null;
  /** Monthly revenue they reported at onboarding, in cents. Used until real clients exist. */
  estimated_revenue_cents: number | null;
}

/** The person who logs in. `id` is their auth.users id. */
export interface MemberRow {
  id: string;
  org_id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: MemberRole;
}

/* ---------- floor inputs ---------- */

/** A monthly cost. Feeds the Life Vest floor. */
export interface ExpenseRow {
  id: string;
  org_id: string;
  created_at: string;
  scope: ExpenseScope;
  /** Onboarding category key ("housing", "software", …). Null = custom expense. */
  category: string | null;
  label: string;
  amount_cents: number;
}

/* ---------- clients ---------- */

/** Anyone who pays you. */
export interface ClientRow {
  id: string;
  org_id: string;
  created_at: string;
  name: string;
  website: string | null;
  status: ClientStatus;
  source_id: string | null;
  signed_on: string;
  notes: string | null;
}

/** A person at a client. At most one primary per client. */
export interface ContactRow {
  id: string;
  org_id: string;
  client_id: string;
  created_at: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  is_primary: boolean;
}

/** What a client pays for. Monthly revenue is derived from these. */
export interface ClientServiceRow {
  id: string;
  org_id: string;
  client_id: string;
  created_at: string;
  name: string;
  /** Amount of ONE payment, not per month. */
  amount_cents: number;
  /** 1 = monthly, 3 = quarterly, 12 = yearly. */
  interval_months: number;
  billing_day: number | null;
  /** Anchors the billing cycle. */
  started_on: string;
  /** Null = still active. */
  ended_on: string | null;
}

/** One expected or received payment. Overdue = unpaid past due_on (derived). */
export interface PaymentRow {
  id: string;
  org_id: string;
  client_id: string;
  /** Null = one-off payment. */
  service_id: string | null;
  created_at: string;
  amount_cents: number;
  due_on: string;
  /** Null = not paid yet. */
  paid_on: string | null;
}

/** A document attached to a client: an uploaded file or a link. */
export interface FileRow {
  id: string;
  org_id: string;
  client_id: string;
  created_at: string;
  kind: FileKind;
  name: string;
  /** Set for uploads. */
  storage_path: string | null;
  /** Set for links. */
  url: string | null;
  mime_type: string | null;
  size_bytes: number | null;
}

/** The client/lead timeline the user reads. Not app logging. */
export interface ActivityRow {
  id: string;
  org_id: string;
  created_at: string;
  /** At least one of client_id / lead_id is set. */
  client_id: string | null;
  lead_id: string | null;
  kind: ActivityKind;
  body: string | null;
  /** When it happened (sort by this), not when it was logged. */
  occurred_at: string;
}

/* ---------- growth ---------- */

/** Where business comes from. */
export interface SourceRow {
  id: string;
  org_id: string;
  created_at: string;
  name: string;
  channel: SourceChannel;
  cost_cents: number;
  started_on: string | null;
  ended_on: string | null;
}

/** A potential client in the pipeline. */
export interface LeadRow {
  id: string;
  org_id: string;
  created_at: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  stage: LeadStage;
  /** Set by a DB trigger whenever stage changes. */
  stage_changed_at: string;
  estimated_monthly_cents: number | null;
  source_id: string | null;
  /** The client this lead became when won. */
  converted_client_id: string | null;
}

/** A user-defined label. Name is unique per org. */
export interface TagRow {
  id: string;
  org_id: string;
  created_at: string;
  name: string;
  color: string | null;
}

/** Which clients have which tags. Primary key is (client_id, tag_id). */
export interface ClientTagRow {
  org_id: string;
  client_id: string;
  tag_id: string;
  created_at: string;
}