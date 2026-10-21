import { IconCircleCheck } from "@tabler/icons-react";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import type { AttentionItem } from "../_lib/attention";
import { AttentionList } from "./attention-list";

type Props = {
  items: AttentionItem[];
  className?: string;
};

/**
 * The dashboard's to-do list. Each row links to where it gets fixed. The
 * count is in the title so you know how many are waiting even when the
 * list scrolls; when there's nothing, the all-clear fills the card.
 */
export function AttentionPanel({ items, className = "" }: Props) {
  return (
    <GlassPanel title={items.length ? `Needs attention · ${items.length}` : "Needs attention"} className={className}>
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
          <IconCircleCheck size={32} stroke={1.6} aria-hidden className="text-[var(--ok)]" />
          <p className="font-semibold">All clear</p>
          <p className="text-sm text-[var(--text-muted)]">Nothing overdue, nothing stuck.</p>
        </div>
      ) : (
        <AttentionList items={items} />
      )}
    </GlassPanel>
  );
}
