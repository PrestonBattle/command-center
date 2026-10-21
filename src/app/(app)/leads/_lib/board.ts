import { LEAD_STAGES } from "@/global/lib/lead-stages";
import { matchesQuery } from "@/global/lib/search";
import type { LeadRow, LeadStage } from "@/global/types/supabase/types";

/** One column of the board, ready to render. */
export type BoardColumn = {
  stage: LeadStage;
  label: string;
  leads: LeadRow[];
  /** Sum of the shown leads' monthly estimates. */
  monthlyCents: number;
};

/** True when a lead matches the board's search box (name, contact, email, phone). */
export function leadMatches(lead: LeadRow, query: string): boolean {
  return matchesQuery(query, [lead.name, lead.contact_name, lead.email, lead.phone]);
}

/**
 * The board: one column per stage, in pipeline order, each holding the
 * leads that match the search, longest-in-stage first so stale leads sit
 * at the top where they get noticed.
 */
export function boardColumns(leads: LeadRow[], query = ""): BoardColumn[] {
  const shown = leads
    .filter((l) => leadMatches(l, query))
    .sort((a, b) => a.stage_changed_at.localeCompare(b.stage_changed_at));

  return LEAD_STAGES.map(({ value, label }) => {
    const inStage = shown.filter((l) => l.stage === value);
    return {
      stage: value,
      label,
      leads: inStage,
      monthlyCents: inStage.reduce((t, l) => t + (l.estimated_monthly_cents ?? 0), 0),
    };
  });
}
