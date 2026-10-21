"use client";

import { notifications } from "@mantine/notifications";
import { useOptimistic, useState, useTransition } from "react";
import { useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import type { LeadRow, LeadStage } from "@/global/types/supabase/types";
import { moveLead } from "../actions";
import { moveInColumns, type BoardColumn } from "../_lib/board";
import { CardPointerSensor, CardTouchSensor, columnKeyboardCoordinates, HandleKeyboardSensor } from "../_lib/drag";

type Move = { leadId: string; to: LeadStage };

/**
 * The board's state: the columns as the server sent them, plus any move
 * still on its way to the server. A move shows instantly (useOptimistic);
 * when the server answers, the page re-renders with real data, and if the
 * save failed the optimistic move simply falls away, so the card snaps
 * back, and a message says why.
 */
export function useLeadBoard(columns: BoardColumn[]) {
  const [shown, applyMove] = useOptimistic(columns, (cols, m: Move) => moveInColumns(cols, m.leadId, m.to));
  const [, startTransition] = useTransition();
  const [dragging, setDragging] = useState<LeadRow | null>(null);

  const sensors = useSensors(
    // 6px of movement before a drag starts, so a click is still a click.
    useSensor(CardPointerSensor, { activationConstraint: { distance: 6 } }),
    // A short press before a drag starts, so a swipe still scrolls.
    useSensor(CardTouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(HandleKeyboardSensor, { coordinateGetter: columnKeyboardCoordinates }),
  );

  const findLead = (id: string | number) => shown.flatMap((c) => c.leads).find((l) => l.id === id);

  /** Moves a lead to a stage: by drag, keyboard, or the card's menu. */
  function move(leadId: string, to: LeadStage) {
    const lead = findLead(leadId);
    if (!lead || lead.stage === to) return;
    const failed = (message?: string) =>
      notifications.show({
        color: "red",
        title: `Couldn't move ${lead.name}`,
        message: message ?? "Something went wrong, so it's back where it was. Try again.",
      });
    startTransition(async () => {
      applyMove({ leadId, to });
      try {
        const result = await moveLead({ leadId, stage: to });
        if (!result.ok) failed(result.formError);
      } catch {
        // Offline or the server didn't answer: the action threw instead of
        // returning a result. Same outcome: the card snaps back.
        failed("Couldn't reach the server, so it's back where it was. Check your connection and try again.");
      }
    });
  }

  function onDragStart({ active }: DragStartEvent) {
    setDragging(findLead(active.id) ?? null);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setDragging(null);
    if (over) move(String(active.id), over.id as LeadStage);
  }

  return {
    columns: shown,
    move,
    dragging,
    sensors,
    onDragStart,
    onDragEnd,
    onDragCancel: () => setDragging(null),
    nameOf: (id: string | number) => findLead(id)?.name ?? "The lead",
  };
}
