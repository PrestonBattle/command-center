import "server-only";

import { revenueByClient } from "@/global/lib/billing";
import { sumExpenses } from "@/global/lib/floor";
import { toFloorFormValues } from "@/global/lib/floor-form";
import type { FloorFormValues } from "@/global/lib/schemas/floor";
import { loadBusiness } from "../../_lib/load-business";

type ClientRevenue = { id: string; name: string; monthlyCents: number };

/**
 * Everything Life vest shows. Plain data: the What if panel and the floor
 * form are client sections, so this goes to the browser.
 */
export type LifeVestView = {
  coverage: {
    revenueCents: number;
    floorCents: number;
    revenueIsEstimate: boolean;
    biggestClient: ClientRevenue | null;
  };
  whatIf: {
    clients: ClientRevenue[];
    revenueCents: number;
    personalCents: number;
    businessCents: number;
    taxRate: number;
  };
  /** The saved costs and tax rate, as the floor form's starting values. */
  floorValues: FloorFormValues;
};

/** Revenue, the floor and the saved costs, shaped for the three Life vest sections. */
export async function getLifeVestView(): Promise<LifeVestView> {
  const data = await loadBusiness();
  const clients = revenueByClient(data.clients, data.services, data.today);
  const { personalCents, businessCents } = sumExpenses(data.expenses);

  return {
    coverage: {
      revenueCents: data.revenueCents,
      floorCents: data.floorCents,
      revenueIsEstimate: data.revenueIsEstimate,
      biggestClient: clients[0] ?? null,
    },
    whatIf: {
      clients,
      revenueCents: data.revenueCents,
      personalCents,
      businessCents,
      taxRate: data.org.tax_reserve_rate,
    },
    floorValues: toFloorFormValues(data.expenses, data.org),
  };
}
