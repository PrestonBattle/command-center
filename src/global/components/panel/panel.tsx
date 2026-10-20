"use client"
import type { ComponentPropsWithoutRef } from "react";

type PanelProps = ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode;
  /**
   * Drops the margin rule. Use for panels holding controls rather than
   * records -- a filter bar, a toolbar, a form. The rule means "this is a
   * record"; putting it on everything makes it mean nothing.
   */
  plain?: boolean;
  /** Tints the rule to carry status. Only for panels showing a number. */
  tone?: "neutral" | "positive" | "caution" | "negative";
};

const TONE_RULE = {
  neutral: "before:bg-[var(--accent)]/30",
  positive: "before:bg-[var(--ok)]/70",
  caution: "before:bg-[var(--warn)]/70",
  negative: "before:bg-[var(--bad)]/70",
} as const;

/**
 * A sheet of paper on the desk mat.
 *
 * Opaque cream, not translucent glass. Glass over a saturated gradient is
 * the default look for this kind of app right now, and it makes text fight
 * the background. Opaque paper reads as a record with weight, which is
 * what this app is actually about.
 *
 * The signature is the hairline accent rule inset from the left edge -- a
 * margin rule, like a ledger or an index card. It's a pseudo-element so
 * padding changes on the panel can't knock it out of alignment.
 */
export function Panel({
  children,
  plain = false,
  tone = "neutral",
  className = "",
  ...props
}: PanelProps) {
  const rule = plain
    ? "pl-6"
    : [
        "pl-11 max-sm:pl-5",
        "before:absolute before:content-['']",
        "before:left-3.5 before:inset-y-3.5 before:w-px",
        "before:pointer-events-none",
        // Below this width the margin stops earning its space.
        "max-sm:before:hidden",
        TONE_RULE[tone],
      ].join(" ");

  return (
    <div
      className={[
        "relative rounded-panel border border-[var(--divider)]",
        "bg-[var(--surface)] text-[var(--text)] p-6",
        rule,
        // className last so callers can override -- later utilities win.
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}