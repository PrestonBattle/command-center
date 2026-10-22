import type { ClientDetails } from "../_server/queries";
import { ContactsPanel } from "./contacts-panel";

type Props = { clientId: string; detailsPromise: Promise<ClientDetails> };

/** The client's contacts once loaded. */
export async function ContactsSection({ clientId, detailsPromise }: Props) {
  const { contacts } = await detailsPromise;
  return <ContactsPanel clientId={clientId} contacts={contacts} />;
}
