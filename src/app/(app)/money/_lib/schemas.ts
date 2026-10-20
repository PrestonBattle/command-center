import { z } from "zod";
import { isoDateField } from "@/global/lib/schemas/fields";

/** Which expected payment to mark paid: a service's charge on a due date. */
export const markPaidSchema = z.object({
  serviceId: z.uuid("Unknown service"),
  dueOn: isoDateField,
});

export const paymentIdSchema = z.uuid("Unknown payment");
