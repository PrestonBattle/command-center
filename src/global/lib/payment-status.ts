import type { BadgeTone } from "@/global/components/layout/status-badge";
import type { PaymentStatus } from "./billing";

/** Badge label and tone for each payment status. Shared by Money and the dashboard. */
export const PAYMENT_STATUS: Record<PaymentStatus, { label: string; tone: BadgeTone }> = {
  paid: { label: "Paid", tone: "ok" },
  overdue: { label: "Overdue", tone: "bad" },
  due: { label: "Due today", tone: "warn" },
  upcoming: { label: "Expected", tone: "neutral" },
};
