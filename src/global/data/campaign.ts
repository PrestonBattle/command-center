import { createClient } from "@/app/supabase/server";
import { APPCONFIG } from "../config/config";
import { CampaignRow } from "../types/supabase/types";

const TABLE = APPCONFIG.table.campaign;

export async function getCampaign(
  orgId?: string | string[],
  campaignId?: string | string[]
): Promise<CampaignRow[]> {
  const supabase = await createClient();
  let query = supabase.from(TABLE).select("*");

  if (typeof orgId === "string") query = query.eq("org_id", orgId);
  else if (Array.isArray(orgId)) query = query.in("org_id", orgId);

  if (typeof campaignId === "string") query = query.eq("id", campaignId);
  else if (Array.isArray(campaignId)) query = query.in("id", campaignId);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch campaigns: ${error.message}`);
  return (data || []) as CampaignRow[];
}

export async function insertCampaign(
  campaign: Omit<CampaignRow, "id">
): Promise<CampaignRow> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(TABLE).insert(campaign).select().single();
  if (error) throw new Error(`Failed to insert campaign: ${error.message}`);
  return data as CampaignRow;
}

export async function updateCampaign(
  id: string,
  updates: Partial<Omit<CampaignRow, "id">>
): Promise<CampaignRow> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(TABLE).update(updates).eq("id", id).select().single();
  if (error) throw new Error(`Failed to update campaign: ${error.message}`);
  return data as CampaignRow;
}

export async function deleteCampaign(id: string | string[]): Promise<void> {
  if (Array.isArray(id) && id.length === 0) return;
  const supabase = await createClient();
  let query = supabase.from(TABLE).delete();
  if (typeof id === "string") query = query.eq("id", id);
  else if (Array.isArray(id)) query = query.in("id", id);
  const { error } = await query;
  if (error) throw new Error(`Failed to delete campaign: ${error.message}`);
}