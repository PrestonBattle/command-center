import { formatShortDate } from "@/global/lib/dates";

/**
 * "· Won from a lead on Oct 3" in the header, if the client came from one.
 * Gets a promise that never rejects: a failed lookup just leaves it out,
 * since it's history, not something to act on.
 */
export async function WonFromLead({ datePromise }: { datePromise: Promise<string | null> }) {
  const date = await datePromise;
  if (!date) return null;
  return <span>· Won from a lead on {formatShortDate(date)}</span>;
}
