import { IconAlertTriangle, IconCircleCheck, IconClockHour4 } from "@tabler/icons-react";
import Link from "next/link";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import type { AttentionItem } from "../_lib/attention";

const ICON = {
  bad: <IconAlertTriangle size={18} aria-hidden className="text-[var(--bad)]" />,
  warn: <IconClockHour4 size={18} aria-hidden className="text-[var(--warn)]" />,
  ok: <IconCircleCheck size={18} aria-hidden className="text-[var(--ok)]" />,
} as const;

/** The dashboard's to-do list. Each row links to where it gets fixed. */
export function AttentionPanel({ items }: { items: AttentionItem[] }) {
  return (
    <GlassPanel title="Needs attention">
      {items.length === 0 ? (
        <p className="flex items-center gap-2 text-sm">
          {ICON.ok} Nothing overdue, nothing stuck. Nice.
        </p>
      ) : (
        <ul className="flex flex-col">
          {items.slice(0, 6).map((item) => (
            <li key={item.id} className="border-t border-[var(--divider)] first:border-t-0">
              <Link href={item.href} className="flex items-start gap-3 rounded-xl py-3 hover:bg-[var(--surface-inset)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
                <span className="mt-0.5">{ICON[item.tone]}</span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-sm text-[var(--text-muted)]">{item.detail}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </GlassPanel>
  );
}
