import type { ClientDetails } from "../_server/queries";
import { PaymentsPanel } from "./payments-panel";

/** Payments received from this client, once loaded. */
export async function ReceivedSection({ detailsPromise }: { detailsPromise: Promise<ClientDetails> }) {
  const { payments } = await detailsPromise;
  return <PaymentsPanel payments={payments} />;
}
