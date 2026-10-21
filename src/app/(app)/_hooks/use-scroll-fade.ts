"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * For a scrolling list: true while there's more below the visible part.
 * Drives a fade at the bottom edge, so a list cut off by its card visibly
 * continues, and the fade goes away once you've scrolled to the end (or
 * when everything fits, as on phones where the list isn't height-limited).
 */
export function useScrollFade<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [moreBelow, setMoreBelow] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (el) setMoreBelow(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  return { ref, moreBelow, onScroll: measure };
}
