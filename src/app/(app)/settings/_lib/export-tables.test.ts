import { describe, expect, it } from "vitest";
import type { ClientRow, PaymentRow } from "@/global/types/supabase/types";
import { exportTable, isExportKey, type ExportSource } from "./export-tables";

const client = { id: "c1", name: "Acme", status: "active", signed_on: "2026-01-02", website: null, notes: null } as ClientRow;
const payment = { client_id: "c1", amount_cents: 125050, due_on: "2026-02-01", paid_on: "2026-02-03" } as PaymentRow;
const src: ExportSource = { clients: [client], contacts: [], services: [], payments: [payment], leads: [] };

describe("exportTable", () => {
  it("labels statuses and keeps blanks blank", () => {
    expect(exportTable("clients", src).rows).toEqual([["Acme", "Active", "2026-01-02", null, null]]);
  });

  it("writes dollars as numbers and names the client", () => {
    expect(exportTable("payments", src).rows).toEqual([["Acme", 1250.5, "2026-02-01", "2026-02-03"]]);
  });
});

describe("isExportKey", () => {
  it("only accepts the offered files", () => {
    expect(isExportKey("leads")).toBe(true);
    expect(isExportKey("members")).toBe(false);
  });
});
