/**
 * PLACEHOLDER — every value here is invented.
 *
 * Keeping it all behind one module means swapping to real queries is a
 * single import change; no panel or page touches these constants directly.
 *
 * When the tables land:
 *   floor parts   <- latest Life_Vest snapshot
 *   revenue       <- sum of Org_Client.mrr, normalized to monthly
 *   arriving      <- Org_Client.billing_date + mrr
 *   pipeline      <- Lead count, won/total close rate, avg Org_Client.mrr
 *   attention     <- stale Lead.created_at, Org_Client contract ends,
 *                    Campaign.end_date in the past
 */

export type AttentionItem = {
  id: string;
  /** 'good' still renders — the tax row is always present. */
  severity: "good" | "caution" | "urgent";
  title: string;
  detail?: string;
  href?: string;
};

export type ArrivingItem = {
  id: string;
  client: string;
  /** Day of month, 1-31. */
  day: number;
  amount: number;
};

const PERSONAL = 2700;
const BUSINESS = 850;
const TAX_RATE = 28;
const REVENUE = 3280;

export function getFloorParts() {
  return { personal: PERSONAL, business: BUSINESS, taxRate: TAX_RATE, revenue: REVENUE };
}

/**
 * How much of the tax reserve this month's revenue actually funds.
 *
 * Revenue pays operating costs first — you can't defer rent to make the
 * reserve. So the reserve gets whatever is left over, which is often
 * nothing even in a month that felt fine.
 */
export function getTaxStatus() {
  const rate = TAX_RATE / 100;
  const floor = BUSINESS + PERSONAL / (1 - rate);
  const needed = floor - PERSONAL - BUSINESS;
  const leftOver = REVENUE - PERSONAL - BUSINESS;
  const covered = Math.max(0, Math.min(needed, leftOver));

  return { needed, covered, shortfall: needed - covered };
}

export function getArriving(): ArrivingItem[] {
  return [
    { id: "1", client: "Riverside Dental", day: 3, amount: 1340 },
    { id: "2", client: "Bayside Family", day: 12, amount: 780 },
    { id: "3", client: "Cedar Point", day: 18, amount: 640 },
    { id: "4", client: "Northgate", day: 28, amount: 520 },
  ];
}

export function getPipeline() {
  return { openLeads: 12, closeRate: 0.18, avgClientMrr: 840 };
}

/** Everything except the tax row, which the panel builds itself. */
export function getAttention(): AttentionItem[] {
  return [
    {
      id: "leads",
      severity: "caution",
      title: "Three leads untouched for 14 days",
      detail: "About $1,700 of expected value",
      href: "/leads",
    },
    {
      id: "contract",
      severity: "caution",
      title: "Bayside contract ends in 41 days",
      detail: "$780 a month",
      href: "/clients",
    },
    {
      id: "campaign",
      severity: "urgent",
      title: "Spring campaign ran past its end date",
      detail: "Still spending $200 a month",
      href: "/campaigns",
    },
    {
      id: "concentration",
      severity: "urgent",
      title: "Riverside Dental is 41% of your revenue",
      detail: "Losing them puts you $2,690 under",
      href: "/clients",
    },
  ];
}

export const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });