import { z } from "zod";
import { intervalMonths, isoDateField, optionalEmail, optionalText, positiveMoney, requiredText } from "@/global/lib/schemas/fields";

/** Client ids come from the URL or a form, so they're checked like any input. */
export const clientIdSchema = z.uuid("Unknown client");

export const statusSchema = z.object({
  clientId: clientIdSchema,
  status: z.enum(["active", "onboarding", "paused", "ended"]),
});

/** A recurring service on a client. */
export const serviceSchema = z.object({
  clientId: clientIdSchema,
  name: requiredText(80),
  amount: positiveMoney,
  interval_months: intervalMonths,
  started_on: isoDateField,
});
export type ServiceFormValues = {
  clientId: string;
  name: string;
  amount: number | string;
  interval_months: string;
  started_on: string;
};

/** A person at a client. */
export const contactSchema = z.object({
  clientId: clientIdSchema,
  name: requiredText(80),
  role: optionalText(80),
  email: optionalEmail,
  phone: optionalText(30),
});
export type ContactFormValues = { clientId: string; name: string; role: string; email: string; phone: string };
