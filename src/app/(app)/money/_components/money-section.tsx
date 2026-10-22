import { formatMonth, monthParam, type YearMonth } from "@/global/lib/dates";
import type { MoneyView } from "../_server/queries";
import { CollectionBar } from "./collection-bar";
import { PaymentsTable } from "./payments-table";

type Props = {
  viewPromise: Promise<MoneyView>;
  month: YearMonth;
  /** ?all=1: every row, not just the first page of each table. */
  showAll: boolean;
};

/** Rows per table before "Show all". */
const ROWS_SHOWN = 25;

/**
 * The month's money once it's loaded: the collected bar, anything still
 * unpaid from earlier months (this month only), and the month's payments.
 * The empty state lives in PaymentsTable ("Nothing expected this month").
 * Each table shows its first 25 rows unless ?all=1; the totals in the bar
 * always count every payment.
 */
export async function MoneySection({ viewPromise, month, showAll }: Props) {
  const { totals, floorCents, rows, earlier } = await viewPromise;
  const limit = showAll ? undefined : ROWS_SHOWN;
  const showAllHref = `/money?month=${monthParam(month)}&all=1`;
  return (
    <>
      <CollectionBar totals={totals} floorCents={floorCents} />
      {earlier.length > 0 && (
        <PaymentsTable title="Still unpaid from earlier months" rows={earlier} limit={limit} showAllHref={showAllHref} />
      )}
      <PaymentsTable
        title={`${formatMonth(month)} payments`}
        rows={rows}
        emptyText="Nothing expected this month"
        limit={limit}
        showAllHref={showAllHref}
      />
    </>
  );
}
