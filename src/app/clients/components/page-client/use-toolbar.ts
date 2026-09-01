"use client";

import { useComputed, useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

type UseToolBarOptions<T> = {
  /** Rows to filter. */
  items: T[];
  /** Fields to match against. Only string fields are checked. */
  searchFields: (keyof T)[];
};

export function useToolBar<T>({ items, searchFields }: UseToolBarOptions<T>) {
  // Required in every component and hook that reads a .value, or the
  // component won't re-render when the signal changes.
  useSignals();

  const searchQuery = useSignal("");

  // useComputed, not useMemo -- it tracks searchQuery automatically, so
  // there's no dependency array to keep in sync.
  const filtered = useComputed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return typeof value === "string" && value.toLowerCase().includes(q);
      })
    );
  });

  // Distinguishes "search matched nothing" from "no clients yet" -- the
  // two empty states want different copy.
  const isEmpty = useComputed(
    () => filtered.value.length === 0 && searchQuery.value.trim().length > 0
  );

  return { searchQuery, filtered, isEmpty };
}