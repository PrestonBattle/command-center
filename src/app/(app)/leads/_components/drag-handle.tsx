"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import { IconGripVertical } from "@tabler/icons-react";

type DragHandleProps = {
  name: string;
  /** dnd-kit's setActivatorNodeRef, so focus returns here after a drop. */
  activatorRef: (el: HTMLElement | null) => void;
  /** dnd-kit's role, tabindex and aria-describedby (the instructions). */
  attributes: DraggableAttributes;
};

/**
 * The grip on a lead card: the keyboard way to drag (Space, arrows, Space).
 * Mouse and touch can grab the whole card; this is what a keyboard focuses.
 * 44px on touch screens, like every other control.
 */
export function DragHandle({ name, activatorRef, attributes }: DragHandleProps) {
  return (
    <button
      ref={activatorRef}
      {...attributes}
      type="button"
      data-drag-handle
      aria-label={`Move ${name}`}
      className="-ml-2 -mt-1 flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md text-[var(--text-faint)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] pointer-coarse:size-11"
    >
      <IconGripVertical size={16} aria-hidden />
    </button>
  );
}
