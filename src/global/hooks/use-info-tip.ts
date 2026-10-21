"use client";

import { useEffect, useRef, useState } from "react";

/** How long the tip waits after the pointer leaves, so you can move onto it. */
const CLOSE_DELAY_MS = 150;

/**
 * Open/close rules for InfoTip, written to WCAG 1.4.13 (content on hover
 * or focus): it opens on hover, focus or tap; it stays open while the
 * pointer is over the "?" or the tip itself; a click or tap pins it open;
 * Escape and a click elsewhere close it.
 */
export function useInfoTip() {
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelLeave = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  };
  useEffect(() => cancelLeave, []);

  function closeAll() {
    cancelLeave();
    setHovering(false);
    setFocused(false);
    setPinned(false);
  }

  return {
    opened: hovering || focused || pinned,
    close: closeAll,
    /** Spread on the "?" button. */
    targetProps: {
      onMouseEnter: () => {
        cancelLeave();
        setHovering(true);
      },
      onMouseLeave: () => {
        leaveTimer.current = setTimeout(() => setHovering(false), CLOSE_DELAY_MS);
      },
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      onClick: () => setPinned((p) => !p),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") closeAll();
      },
    },
    /** Spread on the tip, so moving the pointer onto it keeps it open. */
    dropdownProps: {
      onMouseEnter: cancelLeave,
      onMouseLeave: () => {
        leaveTimer.current = setTimeout(() => setHovering(false), CLOSE_DELAY_MS);
      },
    },
  };
}
