import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  type Announcements,
  type KeyboardCoordinateGetter,
} from "@dnd-kit/core";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, TouchEvent as ReactTouchEvent } from "react";
import { LEAD_STAGES } from "@/global/lib/lead-stages";
import type { LeadStage } from "@/global/types/supabase/types";

/*
 * Drag-and-drop rules for the leads board (dnd-kit). The whole card can be
 * grabbed with a mouse or finger, but never from its buttons, links or
 * inputs: pressing "Make client" or the "⋯" menu must click, not drag.
 * The keyboard only picks up from the grip handle (data-drag-handle), so
 * pressing Space in a form field can't start a drag either.
 */

const INTERACTIVE = "button:not([data-drag-handle]), a, input, select, textarea, [role='menuitem'], [role='combobox']";

function startsOnControl(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(INTERACTIVE) !== null;
}

/** Mouse and pen: grab anywhere on the card except its controls. */
export class CardPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent }: ReactPointerEvent) => nativeEvent.isPrimary && nativeEvent.button === 0 && !startsOnControl(nativeEvent.target),
    },
  ];
}

/** Touch: same rule. Activation waits for a short press (see the board) so swipes still scroll. */
export class CardTouchSensor extends TouchSensor {
  static activators = [
    {
      eventName: "onTouchStart" as const,
      handler: ({ nativeEvent }: ReactTouchEvent) => !startsOnControl(nativeEvent.target),
    },
  ];
}

/** Keyboard: Space or Enter on the grip handle only. */
export class HandleKeyboardSensor extends KeyboardSensor {
  static activators = [
    {
      eventName: "onKeyDown" as const,
      handler: ({ nativeEvent }: ReactKeyboardEvent) =>
        (nativeEvent.code === "Space" || nativeEvent.code === "Enter") &&
        nativeEvent.target instanceof Element &&
        nativeEvent.target.hasAttribute("data-drag-handle"),
    },
  ];
}

const ORDER = LEAD_STAGES.map((s) => s.value);
const FORWARD = ["ArrowRight", "ArrowDown"];
const BACK = ["ArrowLeft", "ArrowUp"];

/**
 * Arrow keys jump a whole column at a time (dnd-kit's default nudges the
 * card 25px, which would take dozens of presses). Columns hidden on phones
 * have no size and are skipped.
 */
export const columnKeyboardCoordinates: KeyboardCoordinateGetter = (event, { context }) => {
  const step = FORWARD.includes(event.code) ? 1 : BACK.includes(event.code) ? -1 : 0;
  if (!step) return undefined;
  event.preventDefault();

  const { active, over, droppableRects, collisionRect } = context;
  const from = (over?.id ?? active?.data.current?.stage) as LeadStage | undefined;
  const visible = ORDER.filter((s) => (droppableRects.get(s)?.width ?? 0) > 0);
  const index = from ? visible.indexOf(from) : -1;
  const target = visible[Math.min(Math.max(index + step, 0), visible.length - 1)];
  const rect = target ? droppableRects.get(target) : undefined;
  if (!rect || !collisionRect) return undefined;

  // Centre the card horizontally in the target column, near its top.
  return { x: rect.left + (rect.width - collisionRect.width) / 2, y: rect.top + 48 };
};

/** What screen readers hear while dragging, in plain words. */
export function leadAnnouncements(nameOf: (id: string | number) => string): Announcements {
  const label = (stage: string | number | undefined) => LEAD_STAGES.find((s) => s.value === stage)?.label ?? "this column";
  return {
    onDragStart: ({ active }) => `Picked up ${nameOf(active.id)} from ${label(active.data.current?.stage)}.`,
    onDragOver: ({ active, over }) => (over ? `${nameOf(active.id)} is over ${label(over.id)}.` : `${nameOf(active.id)} is not over a column.`),
    onDragEnd: ({ active, over }) => (over ? `Moved ${nameOf(active.id)} to ${label(over.id)}.` : `${nameOf(active.id)} was dropped and stays where it was.`),
    onDragCancel: ({ active }) => `Cancelled. ${nameOf(active.id)} stays in ${label(active.data.current?.stage)}.`,
  };
}

/** Read before a drag starts by screen readers, on the grip handle. */
export const DRAG_INSTRUCTIONS =
  "To move this lead to another stage, press Space, use the arrow keys to choose a column, then press Space again. Press Escape to cancel.";
