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
 * The Harbor primary, light to dark, built from the palette (mist, powder,
 * harbor, midnight). Shade 8 is harbor blue, the same as `--accent`, so
 * buttons and links match; white text on it is over 9:1. Dark themes
 * override the primary through CSS variables in themes.css.
 * Hex lives here because Mantine needs real colors to build its variants.
 */
const HARBOR: MantineColorsTuple = [
  "#eef3f6", "#dce6ec", "#b9cbd8", "#94afc2", "#6f93ab",
  "#4f7690", "#3a6079", "#33566e", "#2c4d63", "#1c3142",
];

/**
 * Secondary buttons (Cancel, Undo, Skip): ink-colored text, not a second
 * accent. Mantine's "dark" is a neutral grey-black; shade 8 here is `--text`.
 */
const INK: MantineColorsTuple = [
  "#f2f5f7", "#dfe6eb", "#bccad4", "#94a8b6", "#6c8496",
  "#4d6577", "#3d5a6e", "#2c4d63", "#1c2b36", "#111b22",
];

/**
 * Filled primary buttons take their label color from `--on-accent`, so each
 * theme decides: white on harbor blue; dark ink on champagne, in Harbor
 * night and inside Harbor deep's cards (white on champagne is ~2:1).
 * Mantine otherwise writes white as an inline style, which no stylesheet
 * can override.
 */
const variantColorResolver: VariantColorsResolver = (input) => {
  const colors = defaultVariantColorsResolver(input);
  const isPrimary = !input.color || input.color === input.theme.primaryColor;
  if (input.variant === "filled" && isPrimary) return { ...colors, color: "var(--on-accent)" };
  return colors;
};

/**
 * Mantine theme for the Harbor themes. Every color other than the primary
 * comes from the CSS variables in globals.css.
 *
 * Input and InputWrapper are the base of every Mantine input, so styling
 * them here styles TextInput, NumberInput, Select, Textarea and the rest.
 */
export const theme = createTheme({
  colors: { harbor: HARBOR, ink: INK },
  primaryColor: "harbor",
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
