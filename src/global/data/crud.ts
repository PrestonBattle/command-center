import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";

type Protected = "id" | "org_id" | "created_at";

export type Update<T> = Partial<Omit<T, Protected>>

export function createCrud<T>(table: string, orgId: string, supabase: SupabaseClient) {

  function query() {
    return supabase.from(table).select("*").eq("org_id", orgId);
  }
  return {

    async list(): Promise<T[]> {

      const { data, error } = await query();

      if (error) throw new Error(`Sorry there was an error fetching data from ${table}, ${error.message}`);

      return data as T[];

    },
    async get(id: string): Promise<T | null> {

      const { data, error } = await query().eq("id", id).maybeSingle();

      if (error) throw new Error(`Sorry there was an error fetching data from ${table}, ${error.message}`);

      return data as T | null;
    },
    async update(id: string, changes: Update<T>): Promise<T> {
      const { data, error } = await supabase
        .from(table)
        .update(changes as Record<string, unknown>)
        .eq("org_id", orgId)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(`${table} item could not be updated, ${error.message}`);

      return data as T;
    },
    async insert(values: Update<T>): Promise<T> {

      const { data, error } = await supabase.from(table).insert({ ...(values as Record<string, unknown>), "org_id": orgId }).select().single();

      if (error) throw new Error(`Failed to insert data: ${error.message}`);
      return data as T;

    },
    async remove(id: string | string[]): Promise<void> {
      const ids = Array.isArray(id) ? id : [id];
      if (ids.length === 0) return;

      const { error } = await supabase
        .from(table)
        .delete()
        .eq("org_id", orgId)
        .in("id", ids);

      if (error) throw new Error(`remove ${table} failed: ${error.message}`);
    },
  };
}