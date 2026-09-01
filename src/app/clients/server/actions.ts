import { getDataLayer } from "@/global/data";
import { ClientRow } from "@/global/types/supabase/types";

export async function getClients(): Promise<ClientRow[]>{
  const dl = await getDataLayer();
  return dl.clients.getClientsByOrg(dl.orgId);
}