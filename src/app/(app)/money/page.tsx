import { PageHeader } from "@/global/components/layout";
import { scheduleForMonth, scheduleTotals } from "@/global/lib/billing";
import { formatMonth, monthParam, parseMonthParam } from "@/global/lib/dates";
import { loadBusiness } from "../_lib/load-business";
import { CollectionBar } from "./_components/collection-bar";
import { MonthNav } from "./_components/month-nav";
import { PaymentsTable } from "./_components/payments-table";
import { earlierOverdue } from "../_lib/earlier-overdue";

type Props = { searchParams: Promise<{ month?: string }> };

/** Money in for one month: what's expected, what's paid, what's late. ?month=YYYY-MM */
export default async function MoneyPage({ searchParams }: Props) {
  const { month: param } = await searchParams;
  const data = await loadBusiness();
  const month = parseMonthParam(param, data.thisMonth);
  const isCurrent = monthParam(month) === monthParam(data.thisMonth);

  const scheduleInput = { today: data.today, clients: data.clients, services: data.services, payments: data.payments };
  const rows = scheduleForMonth({ ...scheduleInput, month });
  const earlier = isCurrent ? earlierOverdue(month, scheduleInput) : [];

  return (
    <>
      <PageHeader title="Money" description={`Cash in, ${formatMonth(month)}`} actions={<MonthNav month={month} isCurrent={isCurrent} />} />
      <CollectionBar totals={scheduleTotals(rows)} floorCents={data.floorCents} />
      {earlier.length > 0 && <PaymentsTable title="Still unpaid from earlier months" rows={earlier} />}
      <PaymentsTable title={`${formatMonth(month)} payments`} rows={rows} emptyText="Nothing expected this month" />
    </>
  );
}
