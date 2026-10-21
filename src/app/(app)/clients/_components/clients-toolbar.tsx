"use client";

import { SegmentedControl } from "@mantine/core";
import Glass from "@/global/components/glass/glass";
import { SearchInput } from "@/global/components/inputs";
import { useSetSearchParam } from "@/global/hooks/use-set-search-param";
import { CLIENT_STATUSES } from "@/global/lib/client-status";

const FILTERS = [{ value: "all", label: "All" }, ...CLIENT_STATUSES.map(({ value, label }) => ({ value, label }))];

/**
 * Search and status filter. Both live in the URL (?q=&status=), so a
 * filtered view can be bookmarked and the server does the filtering.
 */
export function ClientsToolbar({ query, status }: { query: string; status: string }) {
  const setParam = useSetSearchParam();

  return (
    <Glass className="flex flex-col gap-3 rounded-2xl p-3 md:flex-row md:items-center">
      <SearchInput className="flex-1" label="Search clients" placeholder="Search by name or email" value={query} />
      {/* Five statuses don't fit a phone's width; the row scrolls sideways
          instead of squashing the words, and the cut-off edge shows there's more. */}
      <div className="-mx-1 max-w-full overflow-x-auto px-1">
        <SegmentedControl aria-label="Filter by status" data={FILTERS} value={status} onChange={(v) => setParam("status", v)} />
      </div>
    </Glass>
  );
}
