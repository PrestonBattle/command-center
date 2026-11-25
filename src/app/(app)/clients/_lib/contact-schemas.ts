import { z } from "zod";
import { clientIdSchema, contactSchema, type ContactFormValues } from "./schemas";

/** An existing contact's details: the add-contact fields plus which contact. */
export const contactUpdateSchema = contactSchema.extend({ contactId: z.uuid("Unknown contact") });
export type ContactUpdateFormValues = ContactFormValues & { contactId: string };

/** Which contact, on which client: for Make primary and Remove. */
export const contactRefSchema = z.object({ contactId: z.uuid("Unknown contact"), clientId: clientIdSchema });
