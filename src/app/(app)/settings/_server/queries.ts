import "server-only";

import { getCurrentOrg } from "@/global/data";
import { getCurrentMember } from "@/global/data/user";
import { timezoneOptions, type TimezoneGroup } from "@/global/lib/timezones";
import { formatPhone } from "../_lib/format-phone";

/** What the Business and Profile panels start from. Plain data: both are forms. */
export type SettingsView = {
  business: { name: string; business_type: string; timezone: string };
  timezones: TimezoneGroup[];
  profile: { first_name: string; last_name: string; phone: string };
  email: string;
};

/**
 * The org and the signed-in member, shaped as the two forms' starting values.
 * Both are cached per request (the app layout already loaded them).
 */
export async function getSettingsView(): Promise<SettingsView> {
  const [org, member] = await Promise.all([getCurrentOrg(), getCurrentMember()]);
  return {
    business: { name: org.name, business_type: org.business_type ?? "", timezone: org.timezone },
    timezones: timezoneOptions(new Date(), org.timezone),
    profile: { first_name: member?.first_name ?? "", last_name: member?.last_name ?? "", phone: formatPhone(member?.phone ?? "") },
    email: member?.email ?? "",
  };
}
