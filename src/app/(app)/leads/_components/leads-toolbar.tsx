import type { ReactNode } from "react";
import Glass from "@/global/components/glass/glass";
import { SearchInput } from "@/global/components/inputs";

type LeadsToolbarProps = {
  query: string;
  /** "3 leads match", streamed in once the board's data is ready. */
  matches?: ReactNode;
};

/**
 * The search box above the board. It renders straight away; the match count
 * streams into a polite live region, so screen-reader users hear the result
 * without leaving the box.
 */
export function LeadsToolbar({ query, matches }: LeadsToolbarProps) {
  return (
    <Glass className="flex flex-col gap-2 rounded-2xl p-3 sm:flex-row sm:items-center">
      <SearchInput
        className="flex-1"
        label="Search leads"
        placeholder="Search by name, contact, email or phone"
        value={query}
      />
      <p aria-live="polite" className="px-1 text-sm text-[var(--text-muted)] sm:shrink-0">
        {matches}
      </p>
    </Glass>
  );
}
