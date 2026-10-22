import { formatMonth, type YearMonth } from "@/global/lib/dates";
import type { MoneyView } from "../_server/queries";
import { CollectionBar } from "./collection-bar";
import { PaymentsTable } from "./payments-table";

type Props = { viewPromise: Promise<MoneyView>; month: YearMonth };

/**
 * The month's money once it's loaded: the collected bar, anything still
 * unpaid from earlier months (this month only), and the month's payments.
 * The empty state lives in PaymentsTable ("Nothing expected this month").
 */
export async function MoneySection({ viewPromise, month }: Props) {
  const { totals, floorCents, rows, earlier } = await viewPromise;
  return (
    <>
      <CollectionBar totals={totals} floorCents={floorCents} />
      {earlier.length > 0 && <PaymentsTable title="Still unpaid from earlier months" rows={earlier} />}
      <PaymentsTable title={`${formatMonth(month)} payments`} rows={rows} emptyText="Nothing expected this month" />
    </>
  );
}
