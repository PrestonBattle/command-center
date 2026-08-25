import { createClient } from "@/app/supabase/server";
import { APPCONFIG } from "../config/config";
import { MembersRow } from "../types/supabase/types";

const TABLE = APPCONFIG.table.members;

export async function getMembers(
  id?: string | string[],
  orgId?: string | string[]
): Promise<MembersRow[]> {
  if (Array.isArray(id) && id.length === 0) return [];

  const supabase = await createClient();
  let query = supabase.from(TABLE).select("*");

  if (typeof id === "string") query = query.eq("id", id);
  else if (Array.isArray(id)) query = query.in("id", id);

  if (typeof orgId === "string") query = query.eq("org_id", orgId);
  else if (Array.isArray(orgId)) query = query.in("org_id", orgId);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch members: ${error.message}`);
  return (data || []) as MembersRow[];
}

export async function insertMember(
  member: Omit<MembersRow, "id" | "created_at">
): Promise<MembersRow> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(TABLE).insert(member).select().single();
  if (error) throw new Error(`Failed to insert member: ${error.message}`);
  return data as MembersRow;
}

export async function updateMember(
  id: string,
  updates: Partial<Omit<MembersRow, "id" | "created_at">>
): Promise<MembersRow> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(TABLE).update(updates).eq("id", id).select().single();
  if (error) throw new Error(`Failed to update member: ${error.message}`);
  return data as MembersRow;
}

export async function deleteMember(id: string | string[]): Promise<void> {
  if (Array.isArray(id) && id.length === 0) return;
  const supabase = await createClient();
  let query = supabase.from(TABLE).delete();
  if (typeof id === "string") query = query.eq("id", id);
  else if (Array.isArray(id)) query = query.in("id", id);
  const { error } = await query;
  if (error) throw new Error(`Failed to delete member: ${error.message}`);
}