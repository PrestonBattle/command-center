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

/** Moves a lead to another stage. A database trigger stamps stage_changed_at. */
export async function moveLead(input: unknown): Promise<ActionResult> {
  const parsed = moveSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const failed = await attempt("leads:move", async () => {
    await (await getDataLayer()).leads.update(parsed.data.leadId, { stage: parsed.data.stage });
  });
  if (failed) return failed;
  revalidatePath("/leads");
  return { ok: true };
}

/** Deletes a lead. */
export async function deleteLead(leadId: unknown): Promise<ActionResult> {
  const parsed = leadIdSchema.safeParse(leadId);
  if (!parsed.success) return { ok: false, formError: "Unknown lead." };
  const failed = await attempt("leads:delete", async () => {
    await (await getDataLayer()).leads.remove(parsed.data);
  });
  if (failed) return failed;
  revalidatePath("/leads");
  return { ok: true };
}

/**
 * Turns a won lead into a client: creates the client (with a monthly service
 * at the estimate, if there is one), links the lead to it and opens the
 * client's page.
 */
export async function convertLead(leadId: unknown): Promise<ActionResult> {
  const parsed = leadIdSchema.safeParse(leadId);
  if (!parsed.success) return { ok: false, formError: "Unknown lead." };

  let clientId = "";
  const failed = await attempt("leads:convert", async () => {
    const [dl, org] = await Promise.all([getDataLayer(), getCurrentOrg()]);
    const lead = await dl.leads.get(parsed.data);
    if (!lead) throw new Error("Lead not found");

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
