"use client";

import { use } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import type { ClientRow } from "@/global/types/supabase/types";
import { useToolBar } from "./use-toolbar";
import { ClientsToolbar } from "./toolbar";
import { ClientsTable } from "../client-table/client-table";

type ClientsPageProps = {
  clientsPromise: Promise<ClientRow[]>;
};

/**
 * Owns the toolbar state because both children need it — the toolbar
 * writes to it, the table reads from it.
 *
 * The signals are passed down as objects, not values. This component never
 * reads .value, so typing in the search box re-renders the toolbar and the
 * table and leaves this one alone.
 */
export function ClientsPage({ clientsPromise }: ClientsPageProps) {
  useSignals();

  const clients = use(clientsPromise);

  const { searchQuery, filtered, isEmpty } = useToolBar({
    items: clients,
    searchFields: ["name", "email"],
  });

  return (
    <div className="flex flex-col gap-4">
      <ClientsToolbar searchQuery={searchQuery} total={clients.length} />
      <ClientsTable
        filtered={filtered}
        isEmpty={isEmpty}
        searchQuery={searchQuery}
        hasAny={clients.length > 0}
      />
    </div>
  );
}