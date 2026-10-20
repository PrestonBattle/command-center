import { ActionIcon, Button } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { addMonths, formatMonth, monthParam, type YearMonth } from "@/global/lib/dates";

type Props = { month: YearMonth; isCurrent: boolean };

/** Previous / next month links, plus a jump back to this month. Plain links, so they work without JS. */
export function MonthNav({ month, isCurrent }: Props) {
  const prev = addMonths(month, -1);
  const next = addMonths(month, 1);
  return (
    <nav aria-label="Month" className="flex items-center gap-2">
      {!isCurrent && (
        <Button component={Link} href="/money" variant="subtle" color="dark" size="compact-md">
          This month
        </Button>
      )}
      <ActionIcon component={Link} href={`/money?month=${monthParam(prev)}`} variant="light" size={44} aria-label={`Previous month, ${formatMonth(prev)}`}>
        <IconChevronLeft size={20} aria-hidden />
      </ActionIcon>
      <ActionIcon component={Link} href={`/money?month=${monthParam(next)}`} variant="light" size={44} aria-label={`Next month, ${formatMonth(next)}`}>
        <IconChevronRight size={20} aria-hidden />
      </ActionIcon>
    </nav>
  );
}
