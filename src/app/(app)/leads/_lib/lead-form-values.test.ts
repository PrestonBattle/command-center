import { describe, expect, it } from "vitest";
import type { LeadRow } from "@/global/types/supabase/types";
import { toLeadFormValues } from "./lead-form-values";
import { leadSchema } from "./schemas";

const LEAD = {
  id: "00000000-0000-4000-8000-000000000001",
  org_id: "00000000-0000-4000-8000-000000000002",
  created_at: "2026-10-01T00:00:00Z",
  name: "Acme Dental",
  contact_name: null,
  email: "hi@acme.test",
  phone: null,
  stage: "contacted",
  stage_changed_at: "2026-10-01T00:00:00Z",
  estimated_monthly_cents: 125050,
  source_id: null,
  converted_client_id: null,
} as LeadRow;

describe("toLeadFormValues", () => {
  it("turns nulls into empty strings and cents into dollars", () => {
    expect(toLeadFormValues(LEAD)).toEqual({
      name: "Acme Dental",
      contact_name: "",
      email: "hi@acme.test",
      phone: "",
      estimated_monthly: 1250.5,
    });
  });

  it("round-trips through the schema back to the same cents", () => {
    const parsed = leadSchema.parse(toLeadFormValues(LEAD));
    expect(parsed.estimated_monthly).toBe(125050);
    expect(parsed.contact_name).toBeUndefined();
  });

  it("leaves a missing estimate blank, not $0", () => {
    expect(toLeadFormValues({ ...LEAD, estimated_monthly_cents: null }).estimated_monthly).toBe("");
  });
});
