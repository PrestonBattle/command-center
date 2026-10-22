import type { ClientDetails } from "../_server/queries";
import { ServicesPanel } from "./services-panel";

type Props = { clientId: string; detailsPromise: Promise<ClientDetails> };

/** The client's services once loaded. */
export async function ServicesSection({ clientId, detailsPromise }: Props) {
  const { services, today } = await detailsPromise;
  return <ServicesPanel clientId={clientId} services={services} today={today} />;
}
