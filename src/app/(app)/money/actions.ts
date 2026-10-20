"use server";

import { revalidatePath } from "next/cache";
import { getCurrentOrg, getDataLayer } from "@/global/data";
import { invalid, type ActionResult } from "@/global/lib/action-result";
import { attempt } from "@/global/lib/attempt";
import { todayIso } from "@/global/lib/dates";
import { markPaidSchema, paymentIdSchema } from "./_lib/schemas";

/** Pages that show payments or totals built from them. */
function refresh() {
  revalidatePath("/money");
  revalidatePath("/");
  revalidatePath("/clients", "layout");
}

/**
 * Records an expected payment as received today. The client and amount are
 * read from the service on the server, never trusted from the browser.
 * Upserts on (service_id, due_on), so double-clicking can't record it twice.
 */
export async function markPaid(input: unknown): Promise<ActionResult> {
  const parsed = markPaidSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const failed = await attempt("money:mark-paid", async () => {
    const [dl, org] = await Promise.all([getDataLayer(), getCurrentOrg()]);
    const service = await dl.clientServices.get(parsed.data.serviceId);
    if (!service) throw new Error("Service not found");
    await dl.payments.upsert(
      [
        {
          client_id: service.client_id,
          service_id: service.id,
          amount_cents: service.amount_cents,
          due_on: parsed.data.dueOn,
          paid_on: todayIso(org.timezone),
        },
      ],
      "service_id,due_on",
    );
  });
  if (failed) return failed;
  refresh();
  return { ok: true };
}

/** Undoes "Mark paid": deletes the payment, so it's expected again. */
export async function undoPayment(paymentId: unknown): Promise<ActionResult> {
  const parsed = paymentIdSchema.safeParse(paymentId);
  if (!parsed.success) return { ok: false, formError: "Unknown payment." };
  const failed = await attempt("money:undo", async () => {
    await (await getDataLayer()).payments.remove(parsed.data);
  });
  if (failed) return failed;
  refresh();
  return { ok: true };
}
