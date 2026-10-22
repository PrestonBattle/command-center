import type { ReactNode } from "react";
import { GlassPanel } from "../glass/glass-panel";
import { SkeletonLine } from "./skeleton-line";
import { SkeletonRegion } from "./skeleton-region";

type Props = {
  /** The panel's real title, shown while its content loads. */
  title: string;
  /** Read as "Loading services…". */
  label: string;
  lines?: number;
  /** Replaces the default lines when the panel has a recognisable shape. */
  children?: ReactNode;
};

/**
 * A titled panel in loading state: its real title (so the page's headings
 * are there from the start) and a few lines, or your own placeholder shapes.
 */
export function SkeletonPanel({ title, label, lines = 3, children }: Props) {
  const widths = ["w-3/4", "w-1/2", "w-2/3", "w-5/12"];
  return (
    <SkeletonRegion label={label}>
      <GlassPanel title={title}>
        {children ??
          Array.from({ length: lines }, (_, i) => <SkeletonLine key={i} width={widths[i % widths.length]} height="h-4" />)}
      </GlassPanel>
    </SkeletonRegion>
  );
}
