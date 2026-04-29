import { createClient } from "@/app/supabase/server";
import { MembersRow } from "../types/supabase/types";
import { APPCONFIG } from "../config/config";

const TABLE = APPCONFIG.table.members;

export async function getMembers(
  id?: string | string[]
): Promise<MembersRow[]>{

  if(Array.isArray(id) && id.length === 0) return []

  const supabase = await createClient();
  let query = supabase.from(TABLE).select("*");

  if(typeof id === "string") query = query.eq("id", id);
  else if(Array.isArray(id)) query = query.in("id", id);

  const {data, error} = await query; 

  if (error) throw new Error(`Failed to fetch members: ${error.message}`);
  return (data || []) as MembersRow[];
}