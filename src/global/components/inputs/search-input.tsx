"use client";

import { TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useSetSearchParam } from "@/global/hooks/use-set-search-param";

type SearchInputProps = {
  /** Screen-reader name, e.g. "Search clients". */
  label: string;
  placeholder: string;
  /** The current ?q= value, from the page's searchParams. */
  value: string;
  className?: string;
};

/**
 * A search box that writes ?q= to the URL as you type (250ms after you stop),
 * so the server filters and the search survives a refresh or a bookmark.
 */
export function SearchInput({ label, placeholder, value, className }: SearchInputProps) {
  const setParam = useSetSearchParam();
  const setQuery = useDebouncedCallback((v: string) => setParam("q", v.trim()), 250);

  return (
    <TextInput
      className={className}
      aria-label={label}
      placeholder={placeholder}
      leftSection={<IconSearch size={18} aria-hidden />}
      defaultValue={value}
      onChange={(e) => setQuery(e.currentTarget.value)}
      type="search"
    />
  );
}
