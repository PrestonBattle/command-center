import { createClient } from "@/app/supabase/server";
import { APPCONFIG } from "../config/config";
import { ClientRow } from "../types/supabase/types";

const TABLE = APPCONFIG.table.clients;

export async function getClients(
  id?: string | string[]
): Promise<ClientRow[]> {
  if (Array.isArray(id) && id.length === 0) return [];

  const supabase = await createClient();
  let query = supabase.from(TABLE).select("*");

  if (typeof id === "string") query = query.eq("id", id);
  else if (Array.isArray(id)) query = query.in("id", id);

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch clients: ${error.message}`);
  return (data || []) as ClientRow[];
}

export async function insertClient(
  client: Omit<ClientRow, "id" | "created_at">
): Promise<ClientRow> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLE)
    .insert(client)
    .select()
    .single();

  if (error) throw new Error(`Failed to insert client: ${error.message}`);
  return data as ClientRow;
}

export async function updateClient(
  id: string,
  updates: Partial<Omit<ClientRow, "id" | "created_at">>
): Promise<ClientRow> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update client: ${error.message}`);
  return data as ClientRow;
}

export async function deleteClient(id: string | string[]): Promise<void> {
  if (Array.isArray(id) && id.length === 0) return;

  const supabase = await createClient();
  let query = supabase.from(TABLE).delete();

  if (typeof id === "string") query = query.eq("id", id);
  else if (Array.isArray(id)) query = query.in("id", id);

  const { error } = await query;

  if (error) throw new Error(`Failed to delete client: ${error.message}`);
}