import { centsToDollars } from "@/global/lib/money";
import type { LeadRow } from "@/global/types/supabase/types";
import type { LeadFormValues } from "./schemas";

/** A blank lead, for the Add form. */
export const EMPTY_LEAD: LeadFormValues = {
  name: "",
  contact_name: "",
  email: "",
  phone: "",
  estimated_monthly: "",
};

/**
 * A saved lead as form values, for the Edit form. Missing values become
 * empty strings (Mantine inputs need a string, not null) and the estimate
 * goes from cents back to the dollars people type.
 */
export function toLeadFormValues(lead: LeadRow): LeadFormValues {
  return {
    name: lead.name,
    contact_name: lead.contact_name ?? "",
    email: lead.email ?? "",
    phone: lead.phone ?? "",
    estimated_monthly: lead.estimated_monthly_cents == null ? "" : centsToDollars(lead.estimated_monthly_cents),
  };
}
