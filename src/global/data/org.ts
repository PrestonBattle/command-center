import { createClient } from "@/app/supabase/server";
import { APPCONFIG } from "../config/config";
import { OrgRow } from "../types/supabase/types";

const TABLE = APPCONFIG.table.org;

export async function getOrg(id?: string | string[]): Promise<OrgRow[]> {
  if (Array.isArray(id) && id.length === 0) return [];

  const supabase = await createClient();
  let query = supabase.from(TABLE).select("*");

  if (typeof id === "string") query = query.eq("id", id);
  else if (Array.isArray(id)) query = query.in("id", id);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch orgs: ${error.message}`);
  return (data || []) as OrgRow[];
}

export async function insertOrg(
  org: Omit<OrgRow, "id" | "created_at">
): Promise<OrgRow> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(TABLE).insert(org).select().single();
  if (error) throw new Error(`Failed to insert org: ${error.message}`);
  return data as OrgRow;
}

export async function updateOrg(
  id: string,
  updates: Partial<Omit<OrgRow, "id" | "created_at">>
): Promise<OrgRow> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(TABLE).update(updates).eq("id", id).select().single();
  if (error) throw new Error(`Failed to update org: ${error.message}`);
  return data as OrgRow;
}

export async function deleteOrg(id: string | string[]): Promise<void> {
  if (Array.isArray(id) && id.length === 0) return;
  const supabase = await createClient();
  let query = supabase.from(TABLE).delete();
  if (typeof id === "string") query = query.eq("id", id);
  else if (Array.isArray(id)) query = query.in("id", id);
  const { error } = await query;
  if (error) throw new Error(`Failed to delete org: ${error.message}`);
}