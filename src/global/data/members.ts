import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { MemberRow } from "../types/supabase/types";
import { DbError, toDbError } from "./errors";
import { TABLES } from "./tables";

/** The only member fields a person can change about themselves. */
export type MemberSelfUpdate = Partial<Pick<MemberRow, "first_name" | "last_name" | "phone">>;

/**
 * People in the org. Not generic CRUD, on purpose:
 *   - no insert: members are created at signup (register_member_org)
 *   - no delete: removing a member means deleting their login (auth user),
 *     which needs the admin client — that belongs in account settings
 *   - update only yourself — matches the "update self" RLS policy
 */
export function createMembers(memberId: string, orgId: string, supabase: SupabaseClient) {
  function query() {
    return supabase.from(TABLES.members).select("*").eq("org_id", orgId);
  }

  return {
    /** Everyone in your org. */
    async list(): Promise<MemberRow[]> {
      const { data, error } = await query();
      if (error) throw toDbError(error, "list members");
      return data as MemberRow[];
    },

    /** One member of your org by id, or null. */
    async get(id: string): Promise<MemberRow | null> {
      const { data, error } = await query().eq("id", id).maybeSingle();
      if (error) throw toDbError(error, "get member");
      return data as MemberRow | null;
    },

    /**
     * Update your own name or phone. Email belongs to auth (change it there),
     * and org_id / role can't be self-edited.
     */
    async updateSelf(changes: MemberSelfUpdate): Promise<MemberRow> {
      // Pick the allowed fields by name, so nothing else can slip through
      // even if `changes` comes from untyped form data.
      const { first_name, last_name, phone } = changes;

      const { data, error } = await supabase
        .from(TABLES.members)
        .update({ first_name, last_name, phone })
        .eq("id", memberId)
        .eq("org_id", orgId)
        .select()
        .maybeSingle();

      if (error) throw toDbError(error, "update member");
      if (!data) throw new DbError("db.not_found", "update member", `no member ${memberId}`);
      return data as MemberRow;
    },
  };
}