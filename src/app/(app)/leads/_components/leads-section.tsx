"use client";

import { use } from "react";
import type { LeadsView } from "../_server/queries";
import { LeadBoard } from "./lead-board";

type Props = {
  viewPromise: Promise<LeadsView>;
  query: string;
};

/**
 * The board, once its data is in. A client section (it unwraps the promise
 * with `use()`) because the board is interactive: dragging, menus, the
 * phone stage picker. Keyed on the search so the picker re-opens on a match.
 */
export function LeadsSection({ viewPromise, query }: Props) {
  const view = use(viewPromise);
  return <LeadBoard key={query} columns={view.columns} today={view.today} searching={Boolean(query)} />;
}
