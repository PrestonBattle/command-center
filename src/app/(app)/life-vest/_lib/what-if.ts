import { calculateFloorCents } from "@/global/lib/floor";

/** Inputs to a what-if, all in cents except the rate. */
export type WhatIfInputs = {
  revenueCents: number;
  personalCents: number;
  businessCents: number;
  taxRate: number;
  /** Monthly revenue lost, e.g. a client leaving. */
  lostCents: number;
  /** Monthly revenue gained, e.g. new clients. */
  gainedCents: number;
  /** Change in monthly personal costs, e.g. rent going up (can be negative). */
  personalChangeCents: number;
};

/** Revenue, floor and the gap between them once the what-if is applied. */
export function applyWhatIf(i: WhatIfInputs) {
  const revenueCents = Math.max(0, i.revenueCents - i.lostCents + i.gainedCents);
  const floorCents = calculateFloorCents({
    personalCents: Math.max(0, i.personalCents + i.personalChangeCents),
    businessCents: i.businessCents,
    taxRate: i.taxRate,
  });
  return { revenueCents, floorCents, gapCents: revenueCents - floorCents };
}

/** Floor coverage as a whole percent: 114 means revenue is 114% of the floor. */
export function coveragePercent(revenueCents: number, floorCents: number): number {
  return floorCents > 0 ? Math.round((revenueCents / floorCents) * 100) : 0;
}
