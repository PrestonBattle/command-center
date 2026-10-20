import { z } from "zod";
import { optionalEmail, optionalMoney, optionalText, requiredText } from "@/global/lib/schemas/fields";

export const leadIdSchema = z.uuid("Unknown lead");

/** A new lead. Only the name is required. */
export const leadSchema = z.object({
  name: requiredText(120),
  contact_name: optionalText(80),
  email: optionalEmail,
  phone: optionalText(30),
  /** What they'd pay per month, in cents, if they sign. */
  estimated_monthly: optionalMoney,
});
export type LeadFormValues = {
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  estimated_monthly: number | string;
};

export const moveSchema = z.object({
  leadId: leadIdSchema,
  stage: z.enum(["new", "contacted", "proposal", "won", "lost"]),
});
