import type { LeadsView } from "../_server/queries";

type Props = {
  /** Never rejects: null when the load failed. */
  viewPromise: Promise<LeadsView | null>;
  query: string;
};

/** "3 leads match", next to the search box. Only while searching. */
export async function LeadsMatchCount({ viewPromise, query }: Props) {
  const view = await viewPromise;
  if (!view || !query) return null;
  return <>{`${view.matchCount} ${view.matchCount === 1 ? "lead matches" : "leads match"}`}</>;
}
