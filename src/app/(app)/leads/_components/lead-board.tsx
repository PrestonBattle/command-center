"use client";

import { DndContext, DragOverlay, pointerWithin, rectIntersection, type CollisionDetection } from "@dnd-kit/core";
import { SegmentedControl } from "@mantine/core";
import { useReducedMotion } from "@mantine/hooks";
import { useState } from "react";
import type { LeadStage } from "@/global/types/supabase/types";
import { useLeadBoard } from "../_hooks/use-lead-board";
import type { BoardColumn } from "../_lib/board";
import { DRAG_INSTRUCTIONS, leadAnnouncements } from "../_lib/drag";
import { LeadCardPreview } from "./lead-card-preview";
import { LeadColumn } from "./lead-column";

type Props = { columns: BoardColumn[]; today: string; searching: boolean };

/** The column under the pointer; for the keyboard (no pointer), the one the card overlaps most. */
const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : rectIntersection(args);
};

/**
 * The board. Desktop: every column side by side at a fixed height, each
 * scrolling on its own, and leads drag between them. Phone: a stage picker
 * and one column; moving is in each card's menu. Every column renders once;
 * the picker only hides the others below md.
 */
export function LeadBoard({ columns, today, searching }: Props) {
  const board = useLeadBoard(columns);
  const reduceMotion = useReducedMotion();
  // While searching, open the first stage that has a match.
  const first = columns.find((c) => c.leads.length > 0)?.stage ?? columns[0].stage;
  const [stage, setStage] = useState<LeadStage>(searching ? first : columns[0].stage);

  return (
    <DndContext
      // A fixed id keeps dnd-kit's generated aria ids the same on server and client.
      id="leads-board"
      sensors={board.sensors}
      collisionDetection={collision}
      onDragStart={board.onDragStart}
      onDragEnd={board.onDragEnd}
      onDragCancel={board.onDragCancel}
      accessibility={{
        announcements: leadAnnouncements(board.nameOf),
        screenReaderInstructions: { draggable: DRAG_INSTRUCTIONS },
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="-mx-1 max-w-full overflow-x-auto px-1 md:hidden">
          <SegmentedControl
            aria-label="Stage to show"
            value={stage}
            onChange={(v) => setStage(v as LeadStage)}
            data={board.columns.map((c) => ({ value: c.stage, label: `${c.label} ${c.leads.length}` }))}
          />
        </div>
        <div className="flex flex-col gap-4 md:h-[calc(100dvh-15.5rem)] md:min-h-96 md:flex-row md:overflow-x-auto">
          {board.columns.map((column) => (
            <LeadColumn
              key={column.stage}
              column={column}
              today={today}
              searching={searching}
              onMove={board.move}
              className={column.stage === stage ? "flex" : "hidden md:flex"}
            />
          ))}
        </div>
      </div>
      {/* The card that follows the pointer. Rendered above everything, so it
          isn't clipped by the scrolling column it came from. */}
      <DragOverlay dropAnimation={reduceMotion ? null : undefined}>
        {board.dragging ? <LeadCardPreview lead={board.dragging} tilt={!reduceMotion} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
