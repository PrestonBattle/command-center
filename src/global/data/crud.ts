import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { DbError, toDbError } from "./errors";

type Protected = "id" | "org_id" | "created_at";

/** What callers may change: any of T's fields except the protected ones. */
export type Update<T> = Partial<Omit<T, Protected>>;

/**
 * What callers may set when creating a row. Like Update<T>, but `id` is
 * allowed: pass your own (crypto.randomUUID()) when child rows need to point
 * at a parent before the insert comes back.
 */
export type Insert<T> = Partial<Omit<T, "org_id" | "created_at">>;

/**
 * Generic CRUD for any org-owned table (one with `id` and `org_id` columns).
 *
 * The table and org are fixed when the factory is built, so callers never
 * pass them — and can't pass the wrong ones. Every method filters by org_id
 * on top of RLS.
 *
 * Every failure throws a DbError: check `e.type` in code, show
 * `e.userMessage` to people, log `e.message`.
 */
export function createCrud<T>(table: string, orgId: string, supabase: SupabaseClient) {
  /** Stamps this org's id on a row. Callers can never choose the org. */
  function withOrg(values: Insert<T>): Record<string, unknown> {
    return { ...(values as Record<string, unknown>), org_id: orgId };
  }

  /** Base query: this table, this org. Not executed until awaited. */
  function query() {
    return supabase.from(table).select("*").eq("org_id", orgId);
  }

  return {
    /** Every row in this org. */
    async list(): Promise<T[]> {
      const { data, error } = await query();
      if (error) throw toDbError(error, `list ${table}`);
      return data as T[];
    },

    /** One row by id, or null if it doesn't exist (or belongs to another org). */
    async get(id: string): Promise<T | null> {
      const { data, error } = await query().eq("id", id).maybeSingle();
      if (error) throw toDbError(error, `get ${table}`);
      return data as T | null;
    },

    /**
     * Change some fields on one row. Returns the updated row.
     * Throws DbError("db.not_found") if the row isn't in this org.
     */
    async update(id: string, changes: Update<T>): Promise<T> {
      const { data, error } = await supabase
        .from(table)
        // T is generic here, so Supabase can't check it; callers are
        // already type-checked by Update<T> in the signature.
        .update(changes as Record<string, unknown>)
        .eq("org_id", orgId)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) throw toDbError(error, `update ${table}`);
      if (!data) throw new DbError("db.not_found", `update ${table}`, `no row ${id}`);
      return data as T;
    },

    /** Create a row in this org. org_id is always set here, never by the caller. */
    async insert(values: Insert<T>): Promise<T> {
      const { data, error } = await supabase
        .from(table)
        .insert(withOrg(values))
        .select()
        .single();

      if (error) throw toDbError(error, `insert ${table}`);
      return data as T;
    },

    /**
     * Create many rows in one request. All or nothing. Don't rely on the
     * returned order; set ids yourself if you need to match rows up.
     */
    async insertMany(values: Insert<T>[]): Promise<T[]> {
      if (values.length === 0) return [];
      const { data, error } = await supabase.from(table).insert(values.map(withOrg)).select();
      if (error) throw toDbError(error, `insert ${table}`);
      return data as T[];
    },

    /**
     * Insert rows, or update the ones that already exist. `onConflict` names
     * the columns of a unique index, e.g. "org_id,category". All or nothing.
     */
    async upsert(values: Insert<T>[], onConflict: string): Promise<T[]> {
      if (values.length === 0) return [];
      const { data, error } = await supabase
        .from(table)
        .upsert(values.map(withOrg), { onConflict })
        .select();
      if (error) throw toDbError(error, `upsert ${table}`);
      return data as T[];
    },

    /** Delete one or more rows. Deleting a row that's already gone is not an error. */
    async remove(id: string | string[]): Promise<void> {
      const ids = Array.isArray(id) ? id : [id];
      if (ids.length === 0) return;

      const { error } = await supabase
        .from(table)
        .delete()
        .eq("org_id", orgId)
        .in("id", ids);

      if (error) throw toDbError(error, `remove ${table}`);
    },
  };
}