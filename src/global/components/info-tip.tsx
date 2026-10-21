"use client";

import { Popover } from "@mantine/core";
import { IconHelpCircle } from "@tabler/icons-react";
import { useId, type ReactNode } from "react";
import { useInfoTip } from "@/global/hooks/use-info-tip";

type InfoTipProps = {
  /** What it explains, for the button's name: "About Overdue". */
  label: string;
  /** The explanation. Plain text (no links or buttons: it's a tip, not a dialog). */
  children: ReactNode;
};

/**
 * A small "?" that explains the number or word next to it. Opens on hover,
 * keyboard focus or tap; stays open while you read it; Escape closes it.
 *
 * Screen readers get the same text as the button's description (read with
 * "About Overdue, button"), so the visible tip is hidden from them rather
 * than read twice.
 */
export function InfoTip({ label, children }: InfoTipProps) {
  const tip = useInfoTip();
  const descriptionId = useId();

  return (
    <Popover
      opened={tip.opened}
      onDismiss={tip.close}
      position="top"
      withArrow
      shadow="md"
      width={260}
      trapFocus={false}
      returnFocus={false}
    >
      <Popover.Target>
        <button
          type="button"
          aria-label={`About ${label}`}
          aria-describedby={descriptionId}
          aria-expanded={tip.opened}
          {...tip.targetProps}
          className="-my-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full align-middle text-[var(--text-faint)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] pointer-coarse:size-11 pointer-coarse:-m-2.5"
        >
          <IconHelpCircle size={16} stroke={1.8} aria-hidden />
        </button>
      </Popover.Target>
      <span id={descriptionId} hidden>
        {children}
      </span>
      <Popover.Dropdown aria-hidden {...tip.dropdownProps} className="text-sm leading-relaxed">
        {children}
      </Popover.Dropdown>
    </Popover>
  );
}
