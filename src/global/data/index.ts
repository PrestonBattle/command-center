import { redirect } from "next/navigation";
import { getCurrentMember } from "./user";
import * as campaigns from "./campaign";
import * as clients from "./clients";
import * as leads from "./leads";
import * as members from "./members";
import * as orgClients from "./org-client";
import * as org from "./org";

/**
 * Returns the application data layer — a typed facade over all authenticated
 * Supabase data modules, plus the resolved caller context.
 *
 * Two guards, two destinations:
 *   - no member row  -> /auth/login   (not signed in, or signup never finished)
 *   - no org_id      -> /onboarding   (signed in, business not set up yet)
 *
 * `orgId` is resolved here rather than passed in by each caller, so no page
 * can accidentally query the wrong tenant — which was possible when callers
 * hand-rolled the lookup or passed a user id by mistake.
 *
 * getCurrentMember is memoized with React cache(), so calling getDataLayer()
 * from the layout, the page, and an action in the same request costs one
 * network round trip, not three.
 *
 * For public (unauthenticated) reads, use `getOpenData()` from
 * `@/global/open` instead.
 *
 * ---
 *
 * **Do not call from /auth/* or /onboarding.** Those routes are where this
 * function redirects to; calling it there loops. Use getCurrentMember()
 * directly in them.
 *
 * **Caching note:** this reads cookies via createClient(). It must not be
 * called inside a `"use cache"` boundary. For cached data fetching, use
 * createClient(accessToken) directly and query Supabase without going
 * through this layer. See `src/app/supabase/server.ts`.
 */
export async function getDataLayer() {
  const member = await getCurrentMember();
  if (!member) redirect("/auth/login");
  if (!member.org_id) redirect("/onboarding");

  return {
    member,
    orgId: member.org_id,

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