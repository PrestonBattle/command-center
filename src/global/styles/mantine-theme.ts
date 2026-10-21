"use client";

import { createTheme, Input, InputWrapper, type MantineColorsTuple } from "@mantine/core";
import inputs from "./inputs.module.css";

/**
 * The Sunset primary, light to dark. Mantine's own orange tops out at
 * #d9480f, which gives white button text only 4.29:1 -- under the 4.5:1
 * minimum. Shade 8 here is the same burnt orange as `--accent` in
 * globals.css, so buttons and links match and white text clears 7:1.
 * Hex lives here because Mantine needs real colors to build its variants.
 */
const SUNSET: MantineColorsTuple = [
  "#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c",
  "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12",
];

/**
 * Mantine theme for the Sunset look. Every color other than the primary
 * comes from the CSS variables in globals.css.
 *
 * Input and InputWrapper are the base of every Mantine input, so styling
 * them here styles TextInput, NumberInput, Select, Textarea and the rest.
 */
export const theme = createTheme({
  colors: { sunset: SUNSET },
  primaryColor: "sunset",
  primaryShade: 8,
  defaultRadius: "md",
  fontFamily: "var(--font-sans)",
  headings: { fontFamily: "var(--font-display)" },
  components: {
    Input: Input.extend({
      classNames: { input: inputs.input, section: inputs.section },
    }),
    InputWrapper: InputWrapper.extend({
      classNames: {
        label: inputs.label,
        description: inputs.description,
        error: inputs.error,
        required: inputs.required,
      },
    }),
  },
});
