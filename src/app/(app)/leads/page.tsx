import { PageHeader } from "@/global/components/layout";
import { getCurrentOrg, getDataLayer } from "@/global/data";
import { todayIso } from "@/global/lib/dates";
import { formatCents } from "@/global/lib/money";
import { AddLeadButton } from "./_components/add-lead-button";
import { LeadColumn } from "./_components/lead-column";
import { LEAD_STAGES, OPEN_STAGES } from "@/global/lib/lead-stages";

/** The pipeline: one column per stage, oldest-moved first so stale leads surface. */
export default async function LeadsPage() {
  const [org, dl] = await Promise.all([getCurrentOrg(), getDataLayer()]);
  const leads = (await dl.leads.list()).sort((a, b) => a.stage_changed_at.localeCompare(b.stage_changed_at));
  const today = todayIso(org.timezone);

  const open = leads.filter((l) => OPEN_STAGES.includes(l.stage));
  const potential = open.reduce((t, l) => t + (l.estimated_monthly_cents ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Leads"
        description={`${open.length} open · ${formatCents(potential)}/mo if they all close`}
        actions={<AddLeadButton />}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {LEAD_STAGES.map((stage) => (
          <LeadColumn key={stage.value} title={stage.label} leads={leads.filter((l) => l.stage === stage.value)} today={today} />
        ))}
      </div>
    </>
  );
}
