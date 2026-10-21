"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentOrg, getDataLayer } from "@/global/data";
import { invalid, type ActionResult } from "@/global/lib/action-result";
import { attempt } from "@/global/lib/attempt";
import { createClientsWithServices } from "@/global/lib/create-clients";
import { todayIso } from "@/global/lib/dates";
import { leadIdSchema, leadSchema, leadUpdateSchema, moveSchema } from "./_lib/schemas";

/** Adds a lead to the New column. */
export async function createLead(input: unknown): Promise<ActionResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { estimated_monthly, contact_name, email, phone, name } = parsed.data;
  const failed = await attempt("leads:create", async () => {
    await (await getDataLayer()).leads.insert({
      name,
      contact_name: contact_name ?? null,
      email: email ?? null,
      phone: phone ?? null,
      estimated_monthly_cents: estimated_monthly ?? null,
    });
  });
  if (failed) return failed;
  revalidatePath("/leads");
  return { ok: true };
}

/**
 * Saves edits to a lead's details. Stage isn't here on purpose: moving a
 * lead goes through moveLead, so the stage clock only resets on a real move.
 */
export async function updateLead(input: unknown): Promise<ActionResult> {
  const parsed = leadUpdateSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { leadId, estimated_monthly, contact_name, email, phone, name } = parsed.data;
  const failed = await attempt("leads:update", async () => {
    await (await getDataLayer()).leads.update(leadId, {
      name,
      contact_name: contact_name ?? null,
      email: email ?? null,
      phone: phone ?? null,
      estimated_monthly_cents: estimated_monthly ?? null,
    });
  });
  if (failed) return failed;
  revalidatePath("/leads");
  revalidatePath("/"); // the dashboard's pipeline total uses the estimate
  return { ok: true };
}

/**
 * Why a converted lead can't be moved or deleted. It's the history of how
 * the client was won; ending the work is a client change (status Ended),
 * which keeps their payments, where deleting would erase them.
 */
function lockedMessage(name: string): string {
  return `${name} is a client now. To stop working with them, set the client to Ended.`;
}

/**
 * Moves a lead to another stage. A database trigger stamps
 * stage_changed_at. Refuses converted leads: the board hides their
 * controls, but the rule has to hold on the server too.
 */
export async function moveLead(input: unknown): Promise<ActionResult> {
  const parsed = moveSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  let locked: string | null = null;
  const failed = await attempt("leads:move", async () => {
    const dl = await getDataLayer();
    const lead = await dl.leads.get(parsed.data.leadId);
    if (!lead) throw new Error("Lead not found");
    if (lead.converted_client_id) {
      locked = lockedMessage(lead.name);
      return;
    }
    await dl.leads.update(lead.id, { stage: parsed.data.stage });
  });
  if (failed) return failed;
  if (locked) return { ok: false, formError: locked };
  revalidatePath("/leads");
  return { ok: true };
}

/** Deletes a lead. Refuses converted leads, like moveLead. */
export async function deleteLead(leadId: unknown): Promise<ActionResult> {
  const parsed = leadIdSchema.safeParse(leadId);
  if (!parsed.success) return { ok: false, formError: "Unknown lead." };
  let locked: string | null = null;
  const failed = await attempt("leads:delete", async () => {
    const dl = await getDataLayer();
    const lead = await dl.leads.get(parsed.data);
    if (!lead) return; // already gone: nothing to do
    if (lead.converted_client_id) {
      locked = lockedMessage(lead.name);
      return;
    }
    await dl.leads.remove(lead.id);
  });
  if (failed) return failed;
  if (locked) return { ok: false, formError: locked };
  revalidatePath("/leads");
  return { ok: true };
}

/**
 * Turns a won lead into a client: creates the client (with a monthly service
 * at the estimate, if there is one), links the lead to it and opens the
 * client's page. Safe to call twice: the second call just opens the client.
 */
export async function convertLead(leadId: unknown): Promise<ActionResult> {
  const parsed = leadIdSchema.safeParse(leadId);
  if (!parsed.success) return { ok: false, formError: "Unknown lead." };

  let clientId = "";
  const failed = await attempt("leads:convert", async () => {
    const [dl, org] = await Promise.all([getDataLayer(), getCurrentOrg()]);
    const lead = await dl.leads.get(parsed.data);
    if (!lead) throw new Error("Lead not found");
    // Already a client (a double click, or a second tab): open that client
    // instead of creating a duplicate.
    if (lead.converted_client_id) {
      clientId = lead.converted_client_id;
      return;
    }

    const today = todayIso(org.timezone);
    if (lead.estimated_monthly_cents) {
      [clientId] = await createClientsWithServices(
        dl,
        [{ name: lead.name, email: lead.email ?? undefined, amount: lead.estimated_monthly_cents, interval_months: 1 }],
        today,
      );
    } else {
      clientId = (await dl.clients.insert({ name: lead.name })).id;
    }
    await dl.leads.update(lead.id, { stage: "won", converted_client_id: clientId });
  });
  if (failed) return failed;
  revalidatePath("/leads");
  revalidatePath("/clients");
  redirect(`/clients/${clientId}`);
}
