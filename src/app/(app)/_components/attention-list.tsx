"use client";

import { IconAlertTriangle, IconCircleCheck, IconClockHour4 } from "@tabler/icons-react";
import Link from "next/link";
import type { AttentionItem } from "../_lib/attention";
import { useScrollFade } from "../_hooks/use-scroll-fade";

const ICON = {
  bad: <IconAlertTriangle size={18} aria-hidden className="text-[var(--bad)]" />,
  warn: <IconClockHour4 size={18} aria-hidden className="text-[var(--warn)]" />,
  ok: <IconCircleCheck size={18} aria-hidden className="text-[var(--ok)]" />,
} as const;

/**
 * The attention rows. On wide screens the card is held to the Snapshot's
 * height, so the list scrolls inside it: focusable so keyboards can scroll
 * it, and faded at the bottom while there's more to see.
 */
export function AttentionList({ items }: { items: AttentionItem[] }) {
  const { ref, moreBelow, onScroll } = useScrollFade<HTMLUListElement>();

  return (
    <ul
      ref={ref}
      onScroll={onScroll}
      tabIndex={0}
      aria-label="Things that need attention"
      data-more-below={moreBelow || undefined}
      className={[
        "-mx-2 flex flex-col rounded-xl px-2 focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
        "lg:min-h-0 lg:flex-1 lg:overflow-y-auto",
        moreBelow ? "[mask-image:linear-gradient(to_bottom,black_calc(100%-3rem),transparent)]" : "",
      ].join(" ")}
    >
      {items.map((item) => (
        <li key={item.id} className="border-t border-[var(--divider)] first:border-t-0">
          <Link
            href={item.href}
            className="flex items-start gap-3 rounded-xl py-3 hover:bg-[var(--surface-inset)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <span className="mt-0.5">{ICON[item.tone]}</span>
            <span className="flex min-w-0 flex-col">
              <span className="font-semibold">{item.title}</span>
              <span className="text-sm text-[var(--text-muted)]">{item.detail}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
