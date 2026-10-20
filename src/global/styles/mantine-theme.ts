"use client";

import { createTheme } from "@mantine/core";

/**
 * Mantine theme for the Sunset look. Mantine's built-in orange is the
 * primary; shade 9 is the darkest, so filled buttons keep their white label
 * readable. Every other color comes from the CSS variables in globals.css.
 */
export const theme = createTheme({
  primaryColor: "orange",
  primaryShade: 9,
  defaultRadius: "md",
});
