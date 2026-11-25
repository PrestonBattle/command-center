import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { EXPORTS } from "../_lib/export-tables";

/**
 * "Your data": one CSV download per table. Plain links (not ButtonLink),
 * because Next's Link would try to prefetch a file download.
 */
export function ExportPanel() {
  return (
    <GlassPanel title="Your data" description="Download everything as CSV files. They open in Excel, Google Sheets or Numbers.">
      <ul className="flex flex-wrap gap-2">
        {EXPORTS.map(({ key, label }) => (
          <li key={key}>
            <Button
              component="a"
              href={`/settings/export/${key}`}
              download
              variant="light"
              color="ink"
              leftSection={<IconDownload size={16} aria-hidden />}
            >
              {label}
              <span className="sr-only"> (CSV download)</span>
            </Button>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
