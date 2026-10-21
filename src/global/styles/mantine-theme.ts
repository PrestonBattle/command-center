"use client";

import {
  ActionIcon,
  Button,
  createTheme,
  defaultVariantColorsResolver,
  Input,
  InputWrapper,
  Modal,
  RadioCard,
  SegmentedControl,
  type MantineColorsTuple,
  type VariantColorsResolver,
} from "@mantine/core";
import controls from "./controls.module.css";
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
 * Warm browns for secondary buttons (Cancel, Undo, Skip). Mantine's "dark"
 * is a neutral near-black that reads cold on the sunset background; shade 8
 * here matches `--text`.
 */
const INK: MantineColorsTuple = [
  "#fdf4ef", "#f6e3d8", "#e9c3ad", "#d69a7c", "#b8714f",
  "#9a4e2f", "#7a3519", "#6c2b12", "#431407", "#2c0d04",
];

/**
 * Filled primary buttons take their label color from `--on-accent`, so each
 * theme decides: white on burnt orange or harbor blue, dark ink on Harbor
 * night's champagne (white on champagne is ~2:1). Mantine otherwise writes
 * white as an inline style, which no stylesheet can override.
 */
const variantColorResolver: VariantColorsResolver = (input) => {
  const colors = defaultVariantColorsResolver(input);
  const isPrimary = !input.color || input.color === input.theme.primaryColor;
  if (input.variant === "filled" && isPrimary) return { ...colors, color: "var(--on-accent)" };
  return colors;
};

/**
 * Mantine theme for the Sunset look. Every color other than the primary
 * comes from the CSS variables in globals.css.
 *
 * Input and InputWrapper are the base of every Mantine input, so styling
 * them here styles TextInput, NumberInput, Select, Textarea and the rest.
 */
export const theme = createTheme({
  colors: { sunset: SUNSET, ink: INK },
  primaryColor: "sunset",
  primaryShade: 8,
  variantColorResolver,
  defaultRadius: "md",
  fontFamily: "var(--font-sans)",
  headings: { fontFamily: "var(--font-display)" },
  components: {
    Button: Button.extend({ classNames: { root: controls.touchTarget } }),
    ActionIcon: ActionIcon.extend({ classNames: { root: controls.touchTarget } }),
    // The X in every dialog is icon-only; without a label screen readers
    // announce just "button".
    Modal: Modal.extend({ defaultProps: { closeButtonProps: { "aria-label": "Close" } } }),
    RadioCard: RadioCard.extend({ classNames: { card: controls.radioCard } }),
    SegmentedControl: SegmentedControl.extend({
      classNames: {
        root: controls.segmentedRoot,
        label: controls.segmentedLabel,
        indicator: controls.segmentedIndicator,
      },
    }),
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
