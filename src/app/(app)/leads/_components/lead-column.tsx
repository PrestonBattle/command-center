import type { LeadRow } from "@/global/types/supabase/types";
import { daysInStage, isStale } from "../_lib/stages";
import { LeadCard } from "./lead-card";

type Props = { title: string; leads: LeadRow[]; today: string };

/** One stage of the board: a heading with a count, then its leads. */
export function LeadColumn({ title, leads, today }: Props) {
  const headingId = `stage-${title.toLowerCase()}`;
  return (
    <section aria-labelledby={headingId} className="flex min-w-0 flex-col gap-3 rounded-3xl border border-[var(--divider)] bg-[var(--surface-inset)] p-3">
      <h2 id={headingId} className="flex items-center justify-between px-1 text-sm font-bold">
        {title}
        <span className="text-[var(--text-faint)]">{leads.length}</span>
      </h2>
      {leads.length === 0 ? (
        <p className="px-1 py-4 text-sm text-[var(--text-faint)]">Nothing here.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} days={daysInStage(lead, today)} stale={isStale(lead, today)} />
          ))}
        </ul>
      )}
    </section>
  );
}
