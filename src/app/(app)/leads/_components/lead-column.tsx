import { daysInStage, isStale } from "@/global/lib/lead-stages";
import type { BoardColumn } from "../_lib/board";
import { LeadCard } from "./lead-card";

type Props = {
  column: BoardColumn;
  today: string;
  /** While searching, an empty column means "no match here", not "empty". */
  searching: boolean;
};

/** One stage of the board: a heading with a count, then its leads. */
export function LeadColumn({ column, today, searching }: Props) {
  const headingId = `stage-${column.stage}`;
  return (
    <section aria-labelledby={headingId} className="flex min-w-0 flex-col gap-3 rounded-3xl border border-[var(--divider)] bg-[var(--surface-inset)] p-3">
      <h2 id={headingId} className="flex items-center justify-between px-1 text-sm font-bold">
        {column.label}
        <span className="text-[var(--text-faint)]">{column.leads.length}</span>
      </h2>
      {column.leads.length === 0 ? (
        <p className="px-1 py-4 text-sm text-[var(--text-faint)]">{searching ? "No matches" : "Nothing here."}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {column.leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} days={daysInStage(lead, today)} stale={isStale(lead, today)} />
          ))}
        </ul>
      )}
    </section>
  );
}
