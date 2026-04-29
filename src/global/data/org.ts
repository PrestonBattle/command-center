import { createClient } from "@/app/supabase/server";
import { APPCONFIG } from "../config/config";
import { OrgRow } from "../types/supabase/types";

const TABLE = APPCONFIG.table.org;

export async function getOrg(
  id?: string | string[]
): Promise<OrgRow[]> {

  if (Array.isArray(id) && id.length === 0) return []

  const supabase = await createClient();
  let query = supabase.from(TABLE).select("*");

  if (typeof id === "string") query = query.eq("id", id);
  else if (Array.isArray(id)) query = query.in("id", id);

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch organization: ${error.message}`);
  return (data || []) as OrgRow[];
}