import { createClient } from "@/app/supabase/server";
import { APPCONFIG } from "../config/config";
import { OrgClientRow } from "../types/supabase/types";

const TABLE = APPCONFIG.table.org_client;

export async function getOrgClient(
  orgId?: string | string[],
  clientId?: string | string[]
): Promise<OrgClientRow[]> {
  if (Array.isArray(orgId) && orgId.length === 0 && Array.isArray(clientId) && clientId.length === 0) return [];

  const supabase = await createClient();
  let query = supabase.from(TABLE).select("*");

  if (typeof orgId === "string") query = query.eq("org_id", orgId);
  else if (Array.isArray(orgId)) query = query.in("org_id", orgId);

  if (typeof clientId === "string") query = query.eq("client_id", clientId);
  else if (Array.isArray(clientId)) query = query.in("client_id", clientId);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch org clients: ${error.message}`);
  return (data || []) as OrgClientRow[];
}

export async function insertOrgClient(
  orgClient: OrgClientRow
): Promise<OrgClientRow> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(TABLE).insert(orgClient).select().single();
  if (error) throw new Error(`Failed to insert org client: ${error.message}`);
  return data as OrgClientRow;
}

export async function updateOrgClient(
  orgId: string,
  clientId: string,
  updates: Partial<Omit<OrgClientRow, "org_id" | "client_id">>
): Promise<OrgClientRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("org_id", orgId)
    .eq("client_id", clientId)
    .select()
    .single();
  if (error) throw new Error(`Failed to update org client: ${error.message}`);
  return data as OrgClientRow;
}

export async function deleteOrgClient(orgId: string, clientId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("org_id", orgId)
    .eq("client_id", clientId);
  if (error) throw new Error(`Failed to delete org client: ${error.message}`);
}