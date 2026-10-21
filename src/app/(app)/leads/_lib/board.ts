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

/**
 * The board right after a move, before the server confirms it: the lead
 * leaves its column and joins the bottom of the target (it's now the
 * newest in that stage, which is where the server will put it too), and
 * both totals update. Unknown lead or same stage: unchanged.
 */
export function moveInColumns(columns: BoardColumn[], leadId: string, to: LeadStage, now = new Date().toISOString()): BoardColumn[] {
  const lead = columns.flatMap((c) => c.leads).find((l) => l.id === leadId);
  if (!lead || lead.stage === to) return columns;
  const moved: LeadRow = { ...lead, stage: to, stage_changed_at: now };
  const value = lead.estimated_monthly_cents ?? 0;

  return columns.map((c) => {
    if (c.stage === lead.stage) return { ...c, leads: c.leads.filter((l) => l.id !== leadId), monthlyCents: c.monthlyCents - value };
    if (c.stage === to) return { ...c, leads: [...c.leads, moved], monthlyCents: c.monthlyCents + value };
    return c;
  });
}
