import { describe, expect, it } from "vitest";
import type { LeadRow, LeadStage } from "@/global/types/supabase/types";
import { boardColumns, moveInColumns } from "./board";

function lead(name: string, stage: LeadStage, changed: string, cents: number | null, extra: Partial<LeadRow> = {}): LeadRow {
  return {
    id: name, org_id: "o", created_at: changed, name, contact_name: null, email: null, phone: null,
    stage, stage_changed_at: changed, estimated_monthly_cents: cents, source_id: null, converted_client_id: null,
    ...extra,
  } as LeadRow;
}

const LEADS = [
  lead("Birch Yoga", "new", "2026-10-10", 40000),
  lead("Acme Dental", "new", "2026-10-01", 120000, { phone: "(904) 555-0199" }),
  lead("Coral Law", "proposal", "2026-10-05", null, { contact_name: "Dana" }),
];

describe("boardColumns", () => {
  it("has every stage in order, even empty ones", () => {
    expect(boardColumns(LEADS).map((c) => c.stage)).toEqual(["new", "contacted", "proposal", "won", "lost"]);
  });

  it("puts the longest-waiting lead first and totals the column", () => {
    const [newCol] = boardColumns(LEADS);
    expect(newCol.leads.map((l) => l.name)).toEqual(["Acme Dental", "Birch Yoga"]);
    expect(newCol.monthlyCents).toBe(160000);
  });

  it("filters every column by the search, including contact and phone", () => {
    const byName = (q: string) => boardColumns(LEADS, q).flatMap((c) => c.leads.map((l) => l.name));
    expect(byName("dana")).toEqual(["Coral Law"]);
    expect(byName("5550199")).toEqual(["Acme Dental"]);
    expect(byName("nobody")).toEqual([]);
  });

  it("totals only what's shown when searching", () => {
    expect(boardColumns(LEADS, "birch")[0].monthlyCents).toBe(40000);
  });
});

describe("moveInColumns", () => {
  const cols = boardColumns(LEADS);
  const col = (c: ReturnType<typeof boardColumns>, stage: string) => {
    const found = c.find((x) => x.stage === stage);
    if (!found) throw new Error(`no ${stage} column`);
    return found;
  };
  const names = (c: ReturnType<typeof boardColumns>, stage: string) => col(c, stage).leads.map((l) => l.name);

  it("moves the lead to the bottom of the target and updates both totals", () => {
    const next = moveInColumns(cols, "Acme Dental", "proposal", "2026-10-21T12:00:00Z");
    expect(names(next, "new")).toEqual(["Birch Yoga"]);
    expect(names(next, "proposal")).toEqual(["Coral Law", "Acme Dental"]);
    expect(next[0].monthlyCents).toBe(40000);
    expect(col(next, "proposal").monthlyCents).toBe(120000);
    expect(col(next, "proposal").leads[1].stage).toBe("proposal");
  });

  it("leaves the board alone for the same stage or an unknown lead", () => {
    expect(moveInColumns(cols, "Acme Dental", "new")).toBe(cols);
    expect(moveInColumns(cols, "nobody", "won")).toBe(cols);
  });
});

