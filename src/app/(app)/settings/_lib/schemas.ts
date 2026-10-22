import { z } from "zod";
import { businessFields, timezoneField } from "@/global/lib/schemas/business";
import { optionalPhone, requiredText } from "@/global/lib/schemas/fields";
import { THEME_IDS } from "@/global/lib/themes";

/** The theme picker's one field. Only known theme ids get into the cookie. */
export const themeSchema = z.object({
  theme: z.enum(THEME_IDS, { error: "Pick a theme" }),
});

export type ThemeInput = z.input<typeof themeSchema>;

/** Business panel: the same name and type rules as onboarding, plus a timezone you pick. */
export const businessSettingsSchema = z.object({
  ...businessFields,
  timezone: timezoneField,
});

export type BusinessSettingsInput = z.input<typeof businessSettingsSchema>;

/** Profile panel. Email isn't here: it's the login, and auth owns it. */
export const profileSchema = z.object({
  first_name: requiredText(50),
  last_name: requiredText(50),
  phone: optionalPhone,
});

export type ProfileInput = z.input<typeof profileSchema>;
