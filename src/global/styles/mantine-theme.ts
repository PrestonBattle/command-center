"use client";

import { createTheme, Input, InputWrapper } from "@mantine/core";
import inputs from "./inputs.module.css";

/**
 * Mantine theme for the Sunset look. Mantine's built-in orange is the
 * primary; shade 9 is the darkest, so filled buttons keep their white label
 * readable. Every other color comes from the CSS variables in globals.css.
 *
 * Input and InputWrapper are the base of every Mantine input, so styling
 * them here styles TextInput, NumberInput, Select, Textarea and the rest.
 */
export const theme = createTheme({
  primaryColor: "orange",
  primaryShade: 9,
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
