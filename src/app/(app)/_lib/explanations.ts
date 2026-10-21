import { OVERDUE_LOOKBACK_MONTHS } from "./earlier-overdue";

/**
 * What each dashboard number means, in plain words, for the "?" tips.
 * Kept together so the wording stays consistent and is easy to edit.
 */
export const DASHBOARD_TIPS = {
  collected:
    "Payments you've marked as paid this month. \"Expected\" is everything your clients' services have due this month, paid or not.",
  overdue: `Payments past their due date that aren't marked paid yet, from this month and the ${OVERDUE_LOOKBACK_MONTHS} before it. Mark them paid on Money once the money arrives.`,
  pipeline:
    "What your open leads (New, Contacted and Proposal) would add each month if they all signed. Uses your own estimates, so it's a best case.",
} as const;
