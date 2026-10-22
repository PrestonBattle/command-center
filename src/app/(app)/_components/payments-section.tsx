import type { BusinessView } from "../_server/queries";
import { UpcomingPaymentsPanel } from "./upcoming-payments-panel";

/** Payments this month, once the money has loaded. */
export async function PaymentsSection({ businessPromise }: { businessPromise: Promise<BusinessView> }) {
  const { upcoming } = await businessPromise;
  return <UpcomingPaymentsPanel rows={upcoming} />;
}
