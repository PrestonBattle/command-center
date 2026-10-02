import "server-only";

import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/app/supabase/server";
import type {
  ActivityRow,
  ClientRow,
  ClientServiceRow,
  ContactRow,
  ExpenseRow,
  FileRow,
  LeadRow,
  PaymentRow,
  SourceRow,
  TagRow,
} from "../types/supabase/types";
import { createClientTags } from "./client-tags";
import { createCrud } from "./crud";
import { createMembers } from "./members";
import { createOrg } from "./org";
import { TABLES } from "./tables";
import { getCurrentMember } from "./user";

/**
 * Builds the data layer for one org. Tests call this directly with their
 * own Supabase client; the app uses getDataLayer() below.
 */
export function createDataLayer(supabase: SupabaseClient, orgId: string, memberId: string) {
  return {
    orgId,

    // Tables with their own rules
    org: createOrg(orgId, supabase),
    members: createMembers(memberId, orgId, supabase),
    clientTags: createClientTags(orgId, supabase),

    // Tables that fit the generic factory
    activities: createCrud<ActivityRow>(TABLES.activities, orgId, supabase),
    clientServices: createCrud<ClientServiceRow>(TABLES.client_services, orgId, supabase),
    clients: createCrud<ClientRow>(TABLES.clients, orgId, supabase),
    contacts: createCrud<ContactRow>(TABLES.contacts, orgId, supabase),
    expenses: createCrud<ExpenseRow>(TABLES.expenses, orgId, supabase),
    files: createCrud<FileRow>(TABLES.files, orgId, supabase),
    leads: createCrud<LeadRow>(TABLES.leads, orgId, supabase),
    payments: createCrud<PaymentRow>(TABLES.payments, orgId, supabase),
    sources: createCrud<SourceRow>(TABLES.sources, orgId, supabase),
    tags: createCrud<TagRow>(TABLES.tags, orgId, supabase),
  };
}

export type DataLayer = ReturnType<typeof createDataLayer>;

/**
 * The data layer for the signed-in user. Redirects to login if there isn't one.
 *
 * Do not call from /auth/* (it redirects there, so it would loop). Not usable
 * inside "use cache" — it reads cookies.
 */
export async function getDataLayer() {
  const member = await getCurrentMember();
  if (!member) redirect("/auth/login");

  const supabase = await createClient();
  return { member, ...createDataLayer(supabase, member.org_id, member.id) };
}

/** Re-exported so callers can `import { DbError } from "@/global/data"`. */
export { DbError } from "./errors";
export type { DbErrorType } from "./errors";