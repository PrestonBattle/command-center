import { PageHeader } from "@/global/components/layout";
import { getCurrentOrg, getDataLayer } from "@/global/data";
import { todayIso } from "@/global/lib/dates";
import { OPEN_STAGES } from "@/global/lib/lead-stages";
import { formatCents } from "@/global/lib/money";
import { AddLeadButton } from "./_components/add-lead-button";
import { LeadBoard } from "./_components/lead-board";
import { LeadsToolbar } from "./_components/leads-toolbar";
import { boardColumns } from "./_lib/board";

type Props = { searchParams: Promise<{ q?: string }> };

/** The pipeline: one column per stage, filtered by ?q= when searching. */
export default async function LeadsPage({ searchParams }: Props) {
  const [{ q = "" }, org, dl] = await Promise.all([searchParams, getCurrentOrg(), getDataLayer()]);
  const leads = await dl.leads.list();
  const today = todayIso(org.timezone);

  // The header describes the whole pipeline, not just what the search shows.
  const open = leads.filter((l) => OPEN_STAGES.includes(l.stage));
  const potential = open.reduce((t, l) => t + (l.estimated_monthly_cents ?? 0), 0);
  const columns = boardColumns(leads, q, today);
  const matchCount = columns.reduce((t, c) => t + c.leads.length, 0);

  return (
    <>
      <PageHeader
        title="Leads"
        description={`${open.length} open · ${formatCents(potential)}/mo if they all close`}
        actions={<AddLeadButton />}
      />
      <LeadsToolbar query={q} matchCount={matchCount} />
      {/* Keyed on the search so the phone stage picker re-opens on a match. */}
      <LeadBoard key={q} columns={columns} today={today} searching={Boolean(q)} />
    </>
  );
}
