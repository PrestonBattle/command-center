"use client";

import { useDroppable } from "@dnd-kit/core";
import { daysInStage, isStale } from "@/global/lib/lead-stages";
import { formatCents } from "@/global/lib/money";
import type { LeadStage } from "@/global/types/supabase/types";
import type { BoardColumn } from "../_lib/board";
import { LeadCard } from "./lead-card";

type Props = {
  column: BoardColumn;
  today: string;
  /** While searching, an empty column means "no match here", not "empty". */
  searching: boolean;
  onMove: (leadId: string, to: LeadStage) => void;
  /** Visibility classes from the board (phones show one column at a time). */
  className?: string;
};

/**
 * One stage of the board, and a drop target: it outlines itself while a
 * lead is dragged over it. On desktop the list scrolls on its own and is
 * focusable, so keyboard users can scroll it too. The header keeps the
 * count and value in view while it scrolls.
 */
export function LeadColumn({ column, today, searching, onMove, className = "" }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.stage });
  const headingId = `stage-${column.stage}`;

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      data-over={isOver || undefined}
      className={[
        "min-w-0 flex-col rounded-3xl border bg-[var(--surface-inset)] transition-[border-color,box-shadow] motion-reduce:transition-none",
        "md:min-h-0 md:min-w-44 md:flex-1",
        isOver ? "border-[var(--accent)] shadow-[inset_0_0_0_1px_var(--accent)]" : "border-[var(--divider)]",
        className,
      ].join(" ")}
    >
      <header className="px-4 pb-2 pt-3">
        <h2 id={headingId} className="text-sm font-bold">
          {column.label} <span className="font-semibold text-[var(--text-faint)]">· {column.leads.length}</span>
        </h2>
        <p className="text-xs font-semibold tabular-nums text-[var(--text-muted)]">
          {column.monthlyCents > 0 ? `${formatCents(column.monthlyCents)}/mo` : " "}
        </p>
      </header>
      <div
        tabIndex={0}
        role="group"
        aria-labelledby={headingId}
        className="rounded-b-3xl px-3 pb-3 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)] md:min-h-0 md:flex-1 md:overflow-y-auto"
      >
        {column.leads.length === 0 ? (
          <p className="px-1 py-4 text-sm text-[var(--text-faint)]">{searching ? "No matches" : "Nothing here."}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {column.leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} days={daysInStage(lead, today)} stale={isStale(lead, today)} onMove={onMove} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
