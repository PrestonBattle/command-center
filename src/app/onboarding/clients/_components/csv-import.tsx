"use client";

import { Button, FileInput, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFileSpreadsheet } from "@tabler/icons-react";
import { useState } from "react";
import { Callout, FieldGrid } from "@/global/components/layout";
import { parseCsvFile, type ParsedCsv } from "@/global/lib/parse-csv";
import type { ClientRowFormValues } from "@/global/lib/schemas/client";
import { MAX_CLIENT_ROWS } from "../../_lib/schemas";
import { CSV_FIELDS, CSV_TEMPLATE, guessMapping, mapCsvRows, type CsvMapping } from "../_lib/csv-columns";

/**
 * "Import from a spreadsheet": pick a CSV, check which column is which
 * (guessed from the headers), and the rows land in the table below for
 * review before anything is saved.
 */
export function CsvImport({ onImport }: { onImport: (rows: ClientRowFormValues[]) => void }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [csv, setCsv] = useState<ParsedCsv | null>(null);
  const [mapping, setMapping] = useState<CsvMapping | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    setError(null);
    setCsv(null);
    if (!file) return;
    try {
      const parsed = await parseCsvFile(file);
      if (parsed.rows.length === 0) return setError("That file has no rows.");
      if (parsed.rows.length > MAX_CLIENT_ROWS) return setError(`Up to ${MAX_CLIENT_ROWS} rows at a time.`);
      setCsv(parsed);
      setMapping(guessMapping(parsed.headers));
    } catch {
      setError("Couldn't read that file. Is it a .csv?");
    }
  }

  const rows = csv && mapping ? mapCsvRows(csv.rows, mapping) : [];
  const ready = mapping?.name && mapping.amount && rows.length > 0;

  function finish() {
    onImport(rows);
    close();
    setCsv(null);
  }

  return (
    <>
      <Button variant="light" leftSection={<IconFileSpreadsheet size={18} aria-hidden />} onClick={open}>
        Import from a spreadsheet
      </Button>
      <Modal opened={opened} onClose={close} title="Import clients from a CSV" size="lg" centered>
        <div className="flex flex-col gap-5">
          <p className="text-sm">
            Export your client list as a .csv from Excel, Google Sheets or your old tool.{" "}
            <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(CSV_TEMPLATE)}`} download="clients-template.csv">
              Download a template
            </a>
            .
          </p>
          <FileInput label="CSV file" accept=".csv,text/csv" placeholder="Choose a file" onChange={handleFile} clearable />
          {error && <Callout tone="bad" role="alert" title={error} />}
          {csv && mapping && (
            <>
              <FieldGrid cols={2}>
                {CSV_FIELDS.map((f) => (
                  <Select
                    key={f.key}
                    label={`${f.label}${f.required ? "" : " (optional)"}`}
                    data={[{ value: "", label: "Not in this file" }, ...csv.headers.map((h) => ({ value: h, label: h }))]}
                    value={mapping[f.key]}
                    onChange={(v) => setMapping({ ...mapping, [f.key]: v ?? "" })}
                    allowDeselect={false}
                  />
                ))}
              </FieldGrid>
              <p role="status" className="text-sm text-[var(--text-muted)]">
                {rows.length} of {csv.rows.length} rows have a client name and will be added.
              </p>
            </>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="subtle" color="ink" onClick={close}>Cancel</Button>
            <Button onClick={finish} disabled={!ready}>
              Add {rows.length || ""} clients
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
