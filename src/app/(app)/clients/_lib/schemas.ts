import { z } from "zod";
import { blankToUndefined, intervalMonths, isoDateField, optionalEmail, optionalText, positiveMoney, requiredText } from "@/global/lib/schemas/fields";

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

/**
 * A website as people type it ("acme.com" or "https://acme.com"), saved
 * with its scheme so it can be linked. Blank means none.
 */
const optionalWebsite = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .max(200, "Keep it under 200 characters")
    .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
    .pipe(z.url({ protocol: /^https?$/, error: "Enter a web address like acme.com" }))
    .optional(),
);

/** The client's own details: what "Edit details" changes. Status has its own picker. */
export const clientDetailsSchema = z.object({
  clientId: clientIdSchema,
  name: requiredText(120),
  website: optionalWebsite,
  signed_on: isoDateField,
  notes: optionalText(2000),
});
export type ClientDetailsFormValues = { clientId: string; name: string; website: string; signed_on: string; notes: string };
