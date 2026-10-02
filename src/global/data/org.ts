import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { OrgRow } from "../types/supabase/types";
import { DbError, toDbError } from "./errors";
import { TABLES } from "./tables";

/** Org fields the app can change. id and created_at are never editable. */
export type OrgUpdate = Partial<Omit<OrgRow, "id" | "created_at">>;

/**
 * Your own org. Not generic CRUD, on purpose:
 *   - the table has no org_id column — the org's `id` IS the org id
 *   - no list: you only ever see your own org
 *   - no insert: orgs are created at signup (register_member_org)
 *   - no delete: closing an account needs its own flow
 *     (cancel billing, delete stored files, delete the login)
 */
export function createOrg(orgId: string, supabase: SupabaseClient) {
  return {
    /** Your org. Throws DbError("db.not_found") if it can't be read. */
    async get(): Promise<OrgRow> {
      const { data, error } = await supabase
        .from(TABLES.orgs)
        .select("*")
        .eq("id", orgId)
        .maybeSingle();

      if (error) throw toDbError(error, "get org");
      if (!data) throw new DbError("db.not_found", "get org", `no org ${orgId}`);
      return data as OrgRow;
    },

    /** Change org settings, e.g. name, tax_reserve_rate, onboarding_step. */
    async update(changes: OrgUpdate): Promise<OrgRow> {
      const { data, error } = await supabase
        .from(TABLES.orgs)
        .update(changes as Record<string, unknown>)
        .eq("id", orgId)
        .select()
        .maybeSingle();

      if (error) throw toDbError(error, "update org");
      if (!data) throw new DbError("db.not_found", "update org", `no org ${orgId}`);
      return data as OrgRow;
    },

    /** Monthly floor in cents. The math lives in SQL: org_floor_cents(). */
    async floorCents(): Promise<number> {
      const { data, error } = await supabase.rpc("org_floor_cents", { p_org: orgId });
      if (error) throw toDbError(error, "org floor");
      return Number(data ?? 0);
    },

    /** Monthly-equivalent revenue in cents. SQL: org_monthly_revenue_cents(). */
    async monthlyRevenueCents(): Promise<number> {
      const { data, error } = await supabase.rpc("org_monthly_revenue_cents", { p_org: orgId });
      if (error) throw toDbError(error, "org revenue");
      return Number(data ?? 0);
    },
  };
}