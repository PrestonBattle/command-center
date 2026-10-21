"use client";

import { SegmentedControl } from "@mantine/core";
import { useState } from "react";
import type { LeadStage } from "@/global/types/supabase/types";
import type { BoardColumn } from "../_lib/board";
import { LeadColumn } from "./lead-column";

type Props = { columns: BoardColumn[]; today: string; searching: boolean };

/**
 * The board. Desktop: every column side by side at a fixed height, each
 * scrolling on its own; if the window is too narrow for five, the board
 * scrolls sideways inside itself instead of squashing cards. Phone: a stage
 * picker and one column, so you never scroll a list inside a scrolling page.
 * Every column renders once; the picker only hides the others below md.
 */
export function LeadBoard({ columns, today, searching }: Props) {
  // While searching, open the first stage that has a match.
  const first = columns.find((c) => c.leads.length > 0)?.stage ?? columns[0].stage;
  const [stage, setStage] = useState<LeadStage>(searching ? first : columns[0].stage);

  return (
    <div className="flex flex-col gap-3">
      <div className="-mx-1 max-w-full overflow-x-auto px-1 md:hidden">
        <SegmentedControl
          aria-label="Stage to show"
          value={stage}
          onChange={(v) => setStage(v as LeadStage)}
          data={columns.map((c) => ({ value: c.stage, label: `${c.label} ${c.leads.length}` }))}
        />
      </div>
      <div className="flex flex-col gap-4 md:h-[calc(100dvh-15.5rem)] md:min-h-96 md:flex-row md:overflow-x-auto">
        {columns.map((column) => (
          <LeadColumn
            key={column.stage}
            column={column}
            today={today}
            searching={searching}
            className={column.stage === stage ? "flex" : "hidden md:flex"}
          />
        ))}
      </div>
    </div>
  );
}
