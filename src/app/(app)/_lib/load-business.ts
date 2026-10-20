import "server-only";

import { getCurrentOrg, getDataLayer } from "@/global/data";
import { monthlyRevenueCents } from "@/global/lib/billing";
import { monthOf, todayIso } from "@/global/lib/dates";
import { floorFromSaved } from "@/global/lib/floor-form";

/**
 * Everything the money views need, loaded in parallel: the org, clients,
 * services, payments and expenses, plus today (in the org's timezone), the
 * floor and monthly revenue. Used by the dashboard, Money and Life vest.
 *
 * Loads whole tables, which is fine for a one-person business (hundreds of
 * rows). If that ever gets slow, add filtered queries to the data layer.
 */
export async function loadBusiness() {
  const [org, dl] = await Promise.all([getCurrentOrg(), getDataLayer()]);
  const [clients, services, payments, expenses] = await Promise.all([
    dl.clients.list(),
    dl.clientServices.list(),
    dl.payments.list(),
    dl.expenses.list(),
  ]);

  const today = todayIso(org.timezone);
  const floorCents = floorFromSaved(expenses, org.tax_reserve_rate);
  const clientRevenueCents = monthlyRevenueCents(clients, services, today);
  // Until real clients exist, the onboarding estimate stands in.
  const revenueCents = clientRevenueCents || (org.estimated_revenue_cents ?? 0);

  return {
    dl,
    org,
    clients,
    services,
    payments,
    expenses,
    today,
    thisMonth: monthOf(today),
    floorCents,
    revenueCents,
    revenueIsEstimate: clientRevenueCents === 0 && revenueCents > 0,
  };
}

export type BusinessData = Awaited<ReturnType<typeof loadBusiness>>;
