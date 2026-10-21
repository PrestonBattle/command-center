import { daysInStage, LEAD_STAGES } from "@/global/lib/lead-stages";
import { matchesQuery } from "@/global/lib/search";
import type { LeadRow, LeadStage } from "@/global/types/supabase/types";

/** One column of the board, ready to render. */
export type BoardColumn = {
  stage: LeadStage;
  label: string;
  leads: LeadRow[];
  /** Sum of the shown leads' monthly estimates. */
  monthlyCents: number;
  /** Leads in this stage kept off the board (old converted wins). */
  hiddenCount: number;
};

/** How long a lead that became a client stays in the Won column. */
export const WON_SHOWN_DAYS = 30;

/**
 * Whether a lead belongs on the board. A lead that became a client is
 * history: it shows in Won for a month so the win is visible, then leaves
 * the board (it's still in the database and still counts in stats). A won
 * lead that isn't a client yet stays: it still needs "Make client".
 */
export function onBoard(lead: LeadRow, today: string): boolean {
  if (!lead.converted_client_id) return true;
  return daysInStage(lead, today) < WON_SHOWN_DAYS;
}

/** True when a lead matches the board's search box (name, contact, email, phone). */
export function leadMatches(lead: LeadRow, query: string): boolean {
  return matchesQuery(query, [lead.name, lead.contact_name, lead.email, lead.phone]);
}

/**
 * The board: one column per stage, in pipeline order, each holding the
 * leads that match the search, longest-in-stage first so stale leads sit
 * at the top where they get noticed.
 */
export function boardColumns(leads: LeadRow[], query: string, today: string): BoardColumn[] {
  const matching = leads
    .filter((l) => leadMatches(l, query))
    .sort((a, b) => a.stage_changed_at.localeCompare(b.stage_changed_at));

  return LEAD_STAGES.map(({ value, label }) => {
    const inStage = matching.filter((l) => l.stage === value);
    const shown = inStage.filter((l) => onBoard(l, today));
    return {
      stage: value,
      label,
      leads: shown,
      monthlyCents: shown.reduce((t, l) => t + (l.estimated_monthly_cents ?? 0), 0),
      hiddenCount: inStage.length - shown.length,
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
