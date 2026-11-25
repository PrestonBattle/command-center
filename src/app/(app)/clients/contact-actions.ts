"use server";

import { getDataLayer } from "@/global/data";
import { invalid, type ActionResult } from "@/global/lib/action-result";
import { attempt } from "@/global/lib/attempt";
import { refreshClient } from "./_lib/refresh";
import { contactRefSchema, contactUpdateSchema } from "./_lib/contact-schemas";

/*
 * Contact edits live beside actions.ts rather than in it, so neither file
 * passes ~150 lines. addContact can move here too once nothing else is
 * editing actions.ts.
 */

/** Saves a contact's name, role, email and phone. */
export async function updateContact(input: unknown): Promise<ActionResult> {
  const parsed = contactUpdateSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { contactId, clientId, name, role, email, phone } = parsed.data;
  const failed = await attempt("clients:update-contact", async () => {
    // Blank optional fields save as null, so clearing one sticks.
    await (await getDataLayer()).contacts.update(contactId, { name, role: role ?? null, email: email ?? null, phone: phone ?? null });
  });
  if (failed) return failed;
  refreshClient(clientId);
  return { ok: true };
}

/**
 * Makes one contact the primary. The database allows one primary per
 * client, so the old one is cleared first. Two writes, not a transaction:
 * if the second fails the client briefly has no primary, which the page
 * handles (it just shows no badge) and Make primary fixes.
 */
export async function makePrimaryContact(input: unknown): Promise<ActionResult> {
  const parsed = contactRefSchema.safeParse(input);
  if (!parsed.success) return { ok: false, formError: "Unknown contact." };
  const { contactId, clientId } = parsed.data;
  const failed = await attempt("clients:primary-contact", async () => {
    const dl = await getDataLayer();
    const current = (await dl.contacts.list()).find((c) => c.client_id === clientId && c.is_primary);
    if (current?.id === contactId) return;
    if (current) await dl.contacts.update(current.id, { is_primary: false });
    await dl.contacts.update(contactId, { is_primary: true });
  });
  if (failed) return failed;
  refreshClient(clientId);
  return { ok: true };
}

/**
 * Removes a contact. If they were the primary, the longest-standing
 * remaining contact takes over, matching "the first contact is primary".
 */
export async function removeContact(input: unknown): Promise<ActionResult> {
  const parsed = contactRefSchema.safeParse(input);
  if (!parsed.success) return { ok: false, formError: "Unknown contact." };
  const { contactId, clientId } = parsed.data;
  const failed = await attempt("clients:remove-contact", async () => {
    const dl = await getDataLayer();
    const theirs = (await dl.contacts.list()).filter((c) => c.client_id === clientId);
    const removed = theirs.find((c) => c.id === contactId);
    await dl.contacts.remove(contactId);
    if (!removed?.is_primary) return;
    const next = theirs.filter((c) => c.id !== contactId).sort((a, b) => a.created_at.localeCompare(b.created_at))[0];
    if (next) await dl.contacts.update(next.id, { is_primary: true });
  });
  if (failed) return failed;
  refreshClient(clientId);
  return { ok: true };
}
