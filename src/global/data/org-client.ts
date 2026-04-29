import { createClient } from "@/app/supabase/server";
import { APPCONFIG } from "../config/config";
import { OrgClientRow } from "../types/supabase/types";

const TABLE = APPCONFIG.table.org_client;

export async function getOrgClient(
  orgId?: string | string[],
  clientId?: string | string[]
): Promise<OrgClientRow[]>{

  if (
    (Array.isArray(orgId) && orgId.length === 0) &&
    (Array.isArray(clientId) && clientId.length === 0)
  ) return [];
  
    const supabase = await createClient();
    let query = supabase.from(TABLE).select("*");
  
    if (typeof orgId === "string") query = query.eq("org_id", orgId);
    else if (Array.isArray(orgId)) query = query.in("org_id", orgId);
  
    const { data, error } = await query;
  
    if (error) throw new Error(`Failed to fetch organization clients: ${error.message}`);
    return (data || []) as OrgClientRow[];

}