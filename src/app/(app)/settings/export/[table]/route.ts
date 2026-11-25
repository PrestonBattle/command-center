import { notFound } from "next/navigation";
import { isExportKey } from "../../_lib/export-tables";
import { buildExport } from "../../_server/export";

/*
 * A route handler, not a server action: this is a read that ends in a file
 * download, which a plain <a href download> does best (no JavaScript, works
 * from any browser). CLAUDE.md's "no API routes" rule is about mutations;
 * this one only reads, through the data layer, and redirects to login when
 * signed out like every page.
 */

type Context = { params: Promise<{ table: string }> };

/** GET /settings/export/clients (or contacts, services, payments, leads) → a CSV file. */
export async function GET(_request: Request, { params }: Context) {
  const { table } = await params;
  if (!isExportKey(table)) notFound();
  const { filename, csv } = await buildExport(table);
  // The byte-order mark makes Excel read the file as UTF-8, so names with
  // accents survive. Sheets and Numbers ignore it.
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      // Someone's client list: never cached by a browser or a proxy.
      "Cache-Control": "private, no-store",
    },
  });
}
