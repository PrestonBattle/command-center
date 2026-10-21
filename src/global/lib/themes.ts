/**
 * The color themes. Each id matches a `[data-theme]` block in
 * global/styles/themes.css; Sunset is the plain `:root` values in globals.css.
 * Swatches are only for the picker's preview chips.
 */
export const THEMES = [
  {
    id: "sunset",
    label: "Sunset",
    description: "Warm peach and pink glass.",
    swatches: ["#fdba74", "#f9a8d4", "#9a3412"],
  },
  {
    id: "harbor",
    label: "Harbor",
    description: "Cool mist and powder blue, with harbor-blue buttons.",
    swatches: ["#DCE6EC", "#F5E6E4", "#2C4D63"],
  },
  {
    id: "harbor-night",
    label: "Harbor night",
    description: "Deep ink and midnight, with champagne accents.",
    swatches: ["#1C2B36", "#2C4D63", "#CDB78E"],
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const THEME_IDS = THEMES.map((t) => t.id) as [ThemeId, ...ThemeId[]];

export const DEFAULT_THEME: ThemeId = "sunset";

/** Name of the cookie that remembers the choice, per device. */
export const THEME_COOKIE = "cc-theme";

/**
 * Turns whatever is in the cookie into a known theme. A cookie can hold
 * anything (an old theme id, a hand-edited value), so unknown means default.
 */
export function toThemeId(value: string | undefined): ThemeId {
  return THEME_IDS.find((id) => id === value) ?? DEFAULT_THEME;
}
