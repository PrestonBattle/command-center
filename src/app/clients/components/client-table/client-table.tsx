"use client";

import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import type { ClientRow } from "@/global/types/supabase/types";
import { Panel } from "@/global/components/panel/panel";

type ClientsTableProps = {
  filtered: Signal<ClientRow[]>;
  isEmpty: Signal<boolean>;
  searchQuery: Signal<string>;
  /** False when the org has no clients at all — a different empty state
      from "your search matched nothing". */
  hasAny: boolean;
};

export function ClientsTable({
  filtered,
  isEmpty,
  searchQuery,
  hasAny,
}: ClientsTableProps) {
  useSignals();

  if (!hasAny) {
    return (
      <Panel plain>
        <p className="text-sm text-ink-muted">
          No clients yet. Add one and the dashboard can start telling you
          whether your revenue clears your floor.
        </p>
      </Panel>
    );
  }

  if (isEmpty.value) {
    return (
      <Panel plain>
        <p className="text-sm text-ink-muted">
          Nothing matches &ldquo;{searchQuery.value}&rdquo;.
        </p>
      </Panel>
    );
  }

  return (
    <Panel plain className="p-0">
      <table className="w-full">
        <thead>
          <tr className="border-b border-paper-edge">
            <Th>Name</Th>
            <Th>Email</Th>
            <Th className="text-right">Monthly</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.value.map((client) => (
            <tr
              key={client.id}
              className="border-b border-paper-edge last:border-0
                         transition-colors hover:bg-paper-dim"
            >
              <td className="px-4 py-3 text-sm text-ink">{client.name}</td>
              <td className="px-4 py-3 text-sm text-ink-muted">
                {client.email ?? "—"}
              </td>
              <td className="px-4 py-3 text-right text-sm tabular-nums text-ink">
                —
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-2.5 text-left text-xs font-medium uppercase
                  tracking-wider text-ink-subtle ${className}`}
    >
      {children}
    </th>
  );
}