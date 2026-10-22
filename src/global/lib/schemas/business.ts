import { z } from "zod";
import { BUSINESS_TYPES, type BusinessTypeKey } from "../business-types";
import { requiredText } from "./fields";

const businessTypeKeys = BUSINESS_TYPES.map((t) => t.key) as [BusinessTypeKey, ...BusinessTypeKey[]];

/**
 * The business fields onboarding and Settings both edit. Each adds its own
 * timezone rule: onboarding fills it from the browser, Settings lets you pick.
 */
export const businessFields = {
  name: requiredText(100),
  business_type: z.enum(businessTypeKeys, { error: "Pick a business type" }),
};

/** True when Intl accepts the name. Works the same in the browser and on the server. */
function isTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * A real IANA timezone ("America/New_York"), so dates never go wrong
 * silently. Asks Intl rather than checking a list: browsers and Node list
 * zones under different names (aliases), but both accept either name.
 */
export const timezoneField = z.string({ error: "Pick a timezone" }).trim().min(1, "Pick a timezone").refine(isTimeZone, "Pick a timezone");
