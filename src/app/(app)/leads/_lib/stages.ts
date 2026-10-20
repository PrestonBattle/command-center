import { daysBetween } from "@/global/lib/dates";
import type { LeadRow, LeadStage } from "@/global/types/supabase/types";

/** Pipeline stages in order, with labels. */
export const LEAD_STAGES: { value: LeadStage; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

/** Stages that are still in play. */
export const OPEN_STAGES: LeadStage[] = ["new", "contacted", "proposal"];

/** A lead sitting in an open stage this long gets flagged. */
export const STALE_AFTER_DAYS = 14;

/** Days since the lead last changed stage. */
export function daysInStage(lead: Pick<LeadRow, "stage_changed_at">, today: string): number {
  return Math.max(0, daysBetween(lead.stage_changed_at.slice(0, 10), today));
}

/** True when an open lead hasn't moved in STALE_AFTER_DAYS. */
export function isStale(lead: Pick<LeadRow, "stage" | "stage_changed_at">, today: string): boolean {
  return OPEN_STAGES.includes(lead.stage) && daysInStage(lead, today) >= STALE_AFTER_DAYS;
}
