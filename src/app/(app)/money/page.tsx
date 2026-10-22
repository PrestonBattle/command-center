import { PageHeader } from "@/global/components/layout";
import { SectionBoundary } from "@/global/components/section-boundary";
import { formatMonth } from "@/global/lib/dates";
import { MoneySection } from "./_components/money-section";
import { MoneySkeleton } from "./_components/money-skeleton";
import { MonthNav } from "./_components/month-nav";
import { getMoneyMonth, getMoneyView } from "./_server/queries";

type Props = { searchParams: Promise<{ month?: string }> };

/** Money in for one month: what's expected, what's paid, what's late. ?month=YYYY-MM */
export default async function MoneyPage({ searchParams }: Props) {
  const { month: param } = await searchParams;
  // Which month (and so the title and month nav) is known at once; see
  // getMoneyMonth for why awaiting it here is free. The money streams in.
  const selected = await getMoneyMonth(param);
  const viewPromise = getMoneyView(selected);

  return (
    <>
      <PageHeader
        title="Money"
        description={`Cash in, ${formatMonth(selected.month)}`}
        actions={<MonthNav month={selected.month} isCurrent={selected.isCurrent} />}
      />
      <SectionBoundary skeleton={<MoneySkeleton />} errorMessage="Couldn't load your payments.">
        <MoneySection viewPromise={viewPromise} month={selected.month} />
      </SectionBoundary>
    </>
  );
}
