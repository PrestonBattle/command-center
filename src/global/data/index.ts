import { redirect } from "next/navigation";
import { isAuthenticated } from "./user";
import * as campaigns from "./campaign";
import * as clients from "./clients";
import * as leads from "./leads";
import * as members from "./members";
import * as orgClients from "./org-client";
import * as org from "./org";

/**
 * Returns the application data layer — a typed facade over all authenticated
 * Supabase data modules. Always call this from server components, server
 * actions, or API routes that require an authenticated user.
 *
 * For public (unauthenticated) reads, use `getOpenData()` from
 * `@/global/open` instead.
 *
 * ---
 *
 * **Caching note:** `getDataLayer` internally calls `createClient()` which
 * reads cookies. It must not be called inside a `"use cache"` boundary.
 * For cached data fetching, use `createClient(accessToken)` directly and
 * query Supabase without going through this layer.
 * See `src/app/supabase/server.ts` for the token-based client pattern.
 */
export async function getDataLayer() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/auth/login");

  return {
    campaigns: {
      getCampaign: campaigns.getCampaign,
      insertCampaign: campaigns.insertCampaign,
      updateCampaign: campaigns.updateCampaign,
      deleteCampaign: campaigns.deleteCampaign,
    },
    clients: {
      getClients: clients.getClients,
      insertClient: clients.insertClient,
      updateClient: clients.updateClient,
      deleteClient: clients.deleteClient,
    },
    leads: {
      getLead: leads.getLead,
      insertLead: leads.insertLead,
      updateLead: leads.updateLead,
      deleteLead: leads.deleteLead,
    },
    members: {
      getMembers: members.getMembers,
      insertMember: members.insertMember,
      updateMember: members.updateMember,
      deleteMember: members.deleteMember,
    },
    orgClients: {
      getOrgClient: orgClients.getOrgClient,
      insertOrgClient: orgClients.insertOrgClient,
      updateOrgClient: orgClients.updateOrgClient,
      deleteOrgClient: orgClients.deleteOrgClient,
    },
    org: {
      getOrg: org.getOrg,
      insertOrg: org.insertOrg,
      updateOrg: org.updateOrg,
      deleteOrg: org.deleteOrg,
    },
  };
}