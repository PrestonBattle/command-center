import type { BadgeTone } from "@/global/components/layout/status-badge";
import type { ClientStatus } from "@/global/types/supabase/types";

/** Every client status with its label and badge tone, in display order. */
export const CLIENT_STATUSES: { value: ClientStatus; label: string; tone: BadgeTone }[] = [
  { value: "active", label: "Active", tone: "ok" },
  { value: "onboarding", label: "Onboarding", tone: "warn" },
  { value: "paused", label: "Paused", tone: "neutral" },
  { value: "ended", label: "Ended", tone: "neutral" },
];

/** Label and tone for one status. */
export function clientStatusMeta(status: ClientStatus) {
  return CLIENT_STATUSES.find((s) => s.value === status) ?? CLIENT_STATUSES[0];
}
