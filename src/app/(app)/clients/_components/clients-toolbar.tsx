"use client";

import { SegmentedControl, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Glass from "@/global/components/glass/glass";
import { CLIENT_STATUSES } from "@/global/lib/client-status";

const FILTERS = [{ value: "all", label: "All" }, ...CLIENT_STATUSES.map(({ value, label }) => ({ value, label }))];

/**
 * Search and status filter. Both live in the URL (?q=&status=), so a
 * filtered view can be bookmarked and the server does the filtering.
 */
export function ClientsToolbar({ query, status }: { query: string; status: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }
  const setQuery = useDebouncedCallback((v: string) => setParam("q", v), 250);

  return (
    <Glass className="flex flex-col gap-3 rounded-2xl p-3 md:flex-row md:items-center">
      <TextInput
        className="flex-1"
        aria-label="Search clients"
        placeholder="Search by name or email"
        leftSection={<IconSearch size={18} aria-hidden />}
        defaultValue={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        type="search"
      />
      <SegmentedControl aria-label="Filter by status" data={FILTERS} value={status} onChange={(v) => setParam("status", v)} />
    </Glass>
  );
}
