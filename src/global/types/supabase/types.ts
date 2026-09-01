export interface OrgRow {
  id: string;
  created_at: string;
  name: string;
}

export interface MembersRow {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  email?: string;
  phone?: string;
  org_id?: string;
}

export type PaymentCycle = "monthly" | "quarterly" | "annually" | "one_time";
export type ClientStatus = "active" | "paused" | "churned";

export interface ClientRow {
  id: string;
  org_id: string;
  name: string;
  email?: string;
  phone?: string;
  signed?: string;
  payment_cycle?: PaymentCycle;
  cycle_value?: number;
  /** Day of the month, 1-31. */
  billing_date?: number;
  status: ClientStatus;
}

export interface CampaignRow {
  id: string;
  org_id: string;
  title?: string;
  description?: string;
  source?: string;
  status?: string;
  cost?: number;
  start_date?: string;
  end_date?: string;
}

export interface LeadRow {
  lead_id: string;
  org_id: string;
  client_id?: string;
  campaign_id?: string;
  created_at: string;
  email?: string;
  status?: string;
  phone?: string;
}