import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { ButtonLink, IconLink } from "@/global/components/button-link";
import { addMonths, formatMonth, monthParam, type YearMonth } from "@/global/lib/dates";

type Props = { month: YearMonth; isCurrent: boolean };

/** Previous / next month links, plus a jump back to this month. Plain links, so they work without JS. */
export function MonthNav({ month, isCurrent }: Props) {
  const prev = addMonths(month, -1);
  const next = addMonths(month, 1);
  return (
    <nav aria-label="Month" className="flex items-center gap-2">
      {!isCurrent && (
        <ButtonLink href="/money" variant="subtle" color="ink" size="compact-md">
          This month
        </ButtonLink>
      )}
      <IconLink href={`/money?month=${monthParam(prev)}`} variant="light" size={44} aria-label={`Previous month, ${formatMonth(prev)}`}>
        <IconChevronLeft size={20} aria-hidden />
      </IconLink>
      <IconLink href={`/money?month=${monthParam(next)}`} variant="light" size={44} aria-label={`Next month, ${formatMonth(next)}`}>
        <IconChevronRight size={20} aria-hidden />
      </IconLink>
    </nav>
  );
}
