"use client";

import { useState } from "react";
import { useActionButton } from "@/global/hooks/use-action-button";
import { toThemeId, type ThemeId } from "@/global/lib/themes";
import { setTheme } from "../actions";

/**
 * The theme picker's state. Switches the page's colors immediately, then
 * saves the choice to the cookie in the background, so the picker feels
 * instant even on a slow connection.
 */
export function useThemeChoice(initial: ThemeId) {
  const [theme, setThemeState] = useState<ThemeId>(initial);
  const save = useActionButton(setTheme);

  function choose(value: string) {
    const id = toThemeId(value);
    setThemeState(id);
    // Instant preview. The server re-render after saving sets the same value.
    document.documentElement.dataset.theme = id;
    save.run({ theme: id });
  }

  return { theme, choose, pending: save.pending, error: save.error };
}
