"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentOrg, getDataLayer } from "@/global/data";
import { invalid, type ActionResult } from "@/global/lib/action-result";
import { attempt } from "@/global/lib/attempt";
import { createClientsWithServices } from "@/global/lib/create-clients";
import { todayIso } from "@/global/lib/dates";
import { clientRowSchema } from "@/global/lib/schemas/client";
import { clientIdSchema, contactSchema, serviceSchema, statusSchema } from "./_lib/schemas";

/** Re-renders the list and the client's page after a change. */
function refresh(clientId?: string) {
  revalidatePath("/clients");
  if (clientId) revalidatePath(`/clients/${clientId}`);
}

/** Adds a client with one recurring service, then opens their page. */
export async function createClient(input: unknown): Promise<ActionResult> {
  const parsed = clientRowSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  let id = "";
  const failed = await attempt("clients:create", async () => {
    const [dl, org] = await Promise.all([getDataLayer(), getCurrentOrg()]);
    [id] = await createClientsWithServices(dl, [parsed.data], todayIso(org.timezone));
  });
  if (failed) return failed;
  refresh();
  redirect(`/clients/${id}`);
}

/** Changes a client's status (active, paused, …). */
export async function updateClientStatus(input: unknown): Promise<ActionResult> {
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const failed = await attempt("clients:status", async () => {
    await (await getDataLayer()).clients.update(parsed.data.clientId, { status: parsed.data.status });
  });
  if (failed) return failed;
  refresh(parsed.data.clientId);
  return { ok: true };
}

/** Deletes a client and, by cascade, their contacts, services and payments. */
export async function deleteClient(clientId: unknown): Promise<ActionResult> {
  const parsed = clientIdSchema.safeParse(clientId);
  if (!parsed.success) return { ok: false, formError: "Unknown client." };
  const failed = await attempt("clients:delete", async () => {
    await (await getDataLayer()).clients.remove(parsed.data);
  });
  if (failed) return failed;
  refresh();
  redirect("/clients");
}

/** Adds a recurring service to a client. */
export async function addService(input: unknown): Promise<ActionResult> {
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { clientId, amount, ...rest } = parsed.data;
  const failed = await attempt("clients:add-service", async () => {
    await (await getDataLayer()).clientServices.insert({ client_id: clientId, amount_cents: amount, ...rest });
  });
  if (failed) return failed;
  refresh(clientId);
  return { ok: true };
}

/** Ends a service today. Past payments stay; it stops appearing in future months. */
export async function endService(serviceId: unknown, clientId: unknown): Promise<ActionResult> {
  const ids = clientIdSchema.safeParse(serviceId);
  const client = clientIdSchema.safeParse(clientId);
  if (!ids.success || !client.success) return { ok: false, formError: "Unknown service." };
  const failed = await attempt("clients:end-service", async () => {
    const org = await getCurrentOrg();
    await (await getDataLayer()).clientServices.update(ids.data, { ended_on: todayIso(org.timezone) });
  });
  if (failed) return failed;
  refresh(client.data);
  return { ok: true };
}

/** Adds a contact; the first contact on a client becomes the primary one. */
export async function addContact(input: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { clientId, ...fields } = parsed.data;
  const failed = await attempt("clients:add-contact", async () => {
    const dl = await getDataLayer();
    const hasPrimary = (await dl.contacts.list()).some((c) => c.client_id === clientId && c.is_primary);
    await dl.contacts.insert({
      client_id: clientId,
      name: fields.name,
      role: fields.role ?? null,
      email: fields.email ?? null,
      phone: fields.phone ?? null,
      is_primary: !hasPrimary,
    });
  });
  if (failed) return failed;
  refresh(clientId);
  return { ok: true };
}
