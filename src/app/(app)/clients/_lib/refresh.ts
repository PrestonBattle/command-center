import "server-only";

import { revalidatePath } from "next/cache";

/** Re-renders the clients list and, when given, that client's page after a change. */
export function refreshClient(clientId?: string) {
  revalidatePath("/clients");
  if (clientId) revalidatePath(`/clients/${clientId}`);
}
