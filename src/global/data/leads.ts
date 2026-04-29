import { createClient } from "@/app/supabase/server";
import { APPCONFIG } from "../config/config";
import { LeadRow } from "../types/supabase/types";

const TABLE = APPCONFIG.table.lead;

export async function getLead(
  orgId?: string | string[],
  clientId?: string | string[],
  campaignId?: string | string[],
  leadId?: string | string[]
): Promise<LeadRow[]> {

  const supabase = await createClient();
  let query = supabase.from(TABLE).select("*");

  if (typeof orgId === "string") query = query.eq("org_id", orgId);
  else if (Array.isArray(orgId)) query = query.in("org_id", orgId);

  if (typeof clientId === "string") query = query.eq("client_id", clientId);
  else if (Array.isArray(clientId)) query = query.in("client_id", clientId);

  if (typeof campaignId === "string") query = query.eq("campaign_id", campaignId);
  else if (Array.isArray(campaignId)) query = query.in("campaign_id", campaignId);

  if (typeof leadId === "string") query = query.eq("lead_id", leadId);
  else if (Array.isArray(leadId)) query = query.in("lead_id", leadId);

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch leads: ${error.message}`);
  return (data || []) as LeadRow[];
}