import { getDataLayer } from "@/global/data";
import { ClientRow } from "@/global/types/supabase/types";

export async function getClients(): Promise<ClientRow[]> {
  const dl = await getDataLayer();
  const rows = await dl.clients.getClients();
  console.log("[clients] orgId:", dl.orgId, "rows:", rows.length);
  return rows;
}