import { z } from "zod";
import { THEME_IDS } from "@/global/lib/themes";

/** The theme picker's one field. Only known theme ids get into the cookie. */
export const themeSchema = z.object({
  theme: z.enum(THEME_IDS, { error: "Pick a theme" }),
});

export type ThemeInput = z.input<typeof themeSchema>;
