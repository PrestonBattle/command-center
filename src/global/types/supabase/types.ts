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

export interface ClientRow {
  id: string;
  org_id: string;
  name: string;
  signed: string;
  phone?: string;
  email?: string;
  payment_cylce?: string;
  billing_date?: string;
  cycle_value?: number;
  mrr?: number;

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