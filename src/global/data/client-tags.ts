import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ClientTagRow } from "../types/supabase/types";
import { toDbError } from "./errors";
import { TABLES } from "./tables";

/**
 * Which clients have which tags. Not generic CRUD, on purpose:
 * this join table has no `id` column — a row IS the (client_id, tag_id)
 * pair — so get(id) / update(id) / remove(id) don't apply. And there's
 * nothing to "update": a client either has a tag or it doesn't.
 */
export function createClientTags(orgId: string, supabase: SupabaseClient) {
  function query() {
    return supabase.from(TABLES.client_tags).select("*").eq("org_id", orgId);
  }

  return {
    /** The tag links for one client. */
    async listForClient(clientId: string): Promise<ClientTagRow[]> {
      const { data, error } = await query().eq("client_id", clientId);
      if (error) throw toDbError(error, "list client tags");
      return data as ClientTagRow[];
    },

    /** Every client link for one tag — "which clients are tagged upsell?" */
    async listForTag(tagId: string): Promise<ClientTagRow[]> {
      const { data, error } = await query().eq("tag_id", tagId);
      if (error) throw toDbError(error, "list tagged clients");
      return data as ClientTagRow[];
    },

    /** Tag a client. Adding a tag it already has does nothing (no error). */
    async add(clientId: string, tagId: string): Promise<void> {
      const { error } = await supabase
        .from(TABLES.client_tags)
        .upsert(
          { org_id: orgId, client_id: clientId, tag_id: tagId },
          { onConflict: "client_id,tag_id", ignoreDuplicates: true },
        );
      if (error) throw toDbError(error, "add client tag");
    },

    /** Untag a client. Removing a tag it doesn't have does nothing (no error). */
    async remove(clientId: string, tagId: string): Promise<void> {
      const { error } = await supabase
        .from(TABLES.client_tags)
        .delete()
        .eq("org_id", orgId)
        .eq("client_id", clientId)
        .eq("tag_id", tagId);
      if (error) throw toDbError(error, "remove client tag");
    },

    /**
     * Make a client's tags exactly `tagIds` — what a tag multi-select saves.
     * Works out what to add and what to remove, so unchanged tags are untouched.
     */
    async set(clientId: string, tagIds: string[]): Promise<void> {
      const current = await this.listForClient(clientId);
      const have = new Set(current.map((row) => row.tag_id));
      const want = new Set(tagIds);

      const toAdd = [...want].filter((id) => !have.has(id));
      const toRemove = [...have].filter((id) => !want.has(id));

      if (toAdd.length > 0) {
        const { error } = await supabase
          .from(TABLES.client_tags)
          .upsert(
            toAdd.map((tag_id) => ({ org_id: orgId, client_id: clientId, tag_id })),
            { onConflict: "client_id,tag_id", ignoreDuplicates: true },
          );
        if (error) throw toDbError(error, "set client tags (add)");
      }

      if (toRemove.length > 0) {
        const { error } = await supabase
          .from(TABLES.client_tags)
          .delete()
          .eq("org_id", orgId)
          .eq("client_id", clientId)
          .in("tag_id", toRemove);
        if (error) throw toDbError(error, "set client tags (remove)");
      }
    },
  };
}