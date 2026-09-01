"use client";

import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Button, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";

type ClientsToolbarProps = {
  searchQuery: Signal<string>;
  total: number;
};

export function ClientsToolbar({ searchQuery, total }: ClientsToolbarProps) {
  // Required in any component that reads a .value. Without it the value is
  // right on first render and never updates again.
  useSignals();

  return (
    <div className="flex items-center gap-3">
      <TextInput
        className="flex-1"
        placeholder={`Search ${total} clients`}
        leftSection={<IconSearch size={16} stroke={1.6} />}
        value={searchQuery.value}
        onChange={(e) => (searchQuery.value = e.currentTarget.value)}
      />

      <Button leftSection={<IconPlus size={16} stroke={1.6} />}>
        Add client
      </Button>
    </div>
  );
}