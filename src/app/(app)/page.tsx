import Link from "next/link";
import { WaterLinePanel } from "@/global/components/dashboard/watertank/waterline-panel";
import { PageHeader, Stat } from "@/global/components/layout";
import { revenueByClient, scheduleForMonth, scheduleTotals } from "@/global/lib/billing";
import { sumExpenses } from "@/global/lib/floor";
import { daysInStage, isStale, OPEN_STAGES } from "@/global/lib/lead-stages";
import { formatCents } from "@/global/lib/money";
import { earlierOverdue } from "./_lib/earlier-overdue";
import { AttentionPanel } from "./_components/attention-panel";
import { DASHBOARD_TIPS } from "./_lib/explanations";
import { UpcomingPaymentsPanel } from "./_components/upcoming-payments-panel";
import { attentionItems } from "./_lib/attention";
import { greeting, hourIn } from "./_lib/greeting";
import { loadBusiness } from "./_lib/load-business";

/** The dashboard: am I OK this month, what's coming in, and what needs doing. */
export default async function DashboardPage() {
  const data = await loadBusiness();
  const leads = await data.dl.leads.list();

  const scheduleInput = { today: data.today, clients: data.clients, services: data.services, payments: data.payments };
  const rows = scheduleForMonth({ ...scheduleInput, month: data.thisMonth });
  const totals = scheduleTotals(rows);
  const overdue = [...earlierOverdue(data.thisMonth, scheduleInput), ...rows.filter((r) => r.status === "overdue")];
  const overdueCents = overdue.reduce((t, r) => t + r.amountCents, 0);

  const openLeads = leads.filter((l) => OPEN_STAGES.includes(l.stage));
  const pipelineCents = openLeads.reduce((t, l) => t + (l.estimated_monthly_cents ?? 0), 0);
  const staleLeads = openLeads.filter((l) => isStale(l, data.today)).map((l) => ({ name: l.name, days: daysInStage(l, data.today) }));

  const { personalCents, businessCents } = sumExpenses(data.expenses);
  const topClient = revenueByClient(data.clients, data.services, data.today)[0];
  const name = data.dl.member.first_name;

  return (
    <>
      <PageHeader title={`${greeting(hourIn(data.org.timezone))}${name ? `, ${name}` : ""}`} description="Here's where things stand this month." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat compact label="Collected this month" info={DASHBOARD_TIPS.collected} value={formatCents(totals.paidCents)} hint={`of ${formatCents(totals.expectedCents)} expected`} />
        <Stat compact label="Overdue" info={DASHBOARD_TIPS.overdue} value={formatCents(overdueCents)} hint={overdue.length ? <Link href="/money" className="underline">{overdue.length} payment{overdue.length === 1 ? "" : "s"} to chase</Link> : "All caught up"} />
        <Stat compact label="Pipeline" info={DASHBOARD_TIPS.pipeline} value={`${formatCents(pipelineCents)}/mo`} hint={<Link href="/leads" className="underline">{openLeads.length} open lead{openLeads.length === 1 ? "" : "s"}</Link>} />
      </div>
      {/* Snapshot sets this row's height; Needs attention matches it and
          scrolls inside (it's taken out of the row's sizing with absolute
          positioning). Below lg everything stacks at its natural height. */}
      <div className="grid gap-6 lg:min-h-72 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <WaterLinePanel
          personal={personalCents / 100}
          business={businessCents / 100}
          taxRate={data.org.tax_reserve_rate * 100}
          revenue={data.revenueCents / 100}
          topClientName={topClient?.name}
          topClientMrr={topClient ? topClient.monthlyCents / 100 : undefined}
        />
        <div className="relative min-w-0">
          <AttentionPanel
            className="lg:absolute lg:inset-0"
            items={attentionItems({ overdue, staleLeads, floorCents: data.floorCents, clientCount: data.clients.length })}
          />
        </div>
      </div>
      <UpcomingPaymentsPanel rows={rows.filter((r) => r.status !== "paid")} />
    </>
  );
}
