import { describe, expect, it } from "vitest";
import { EXAMPLE_FLOOR, explainerSteps } from "./explainer-steps";
import { waterlineState } from "./waterline-state";

describe("explainerSteps", () => {
  const steps = explainerSteps(4000, 0.8);

  it("walks the line, the four states, then you", () => {
    expect(steps.map((s) => s.key)).toEqual(["line", "under", "treading", "afloat", "clear", "you"]);
  });

  it("puts each example level inside its own state", () => {
    for (const s of steps.slice(1, 5)) expect(waterlineState(s.coverage)).toBe(s.state);
  });

  it("uses the person's floor for the numbers", () => {
    const under = steps[1];
    expect(under.gapDollars).toBe(1000); // 25% of 4,000
    expect(under.short).toBe(true);
    expect(under.title).toContain("$3,000");
    expect(steps[4].short).toBe(false);
  });

  it("ends on where they really are", () => {
    const you = steps[5];
    expect(you.coverage).toBe(0.8);
    expect(you.state).toBe("under");
    expect(you.gapDollars).toBe(800);
    expect(you.body).toContain("80%");
  });

  it("falls back to an example floor when none is set", () => {
    const noFloor = explainerSteps(0, 0);
    expect(noFloor[1].gapDollars).toBe(EXAMPLE_FLOOR * 0.25);
    expect(noFloor[0].body).toContain("an example");
    expect(noFloor[5].state).toBeNull();
    expect(noFloor[5].title).toMatch(/Set your floor/);
  });
});
