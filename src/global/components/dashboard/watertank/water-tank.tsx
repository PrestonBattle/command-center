/**
 * The floor line sits at 70% of the container height, leaving 30% of
 * headroom for margin to render above it. The strip therefore tops out
 * around 143% of the floor -- past that the fill pins, which is fine:
 * someone doing that well doesn't need this panel.
 */
const LINE_AT = 70;

type WaterLineTankProps = {
  /** revenue / floor. 0.71 is 71%. Above 1 means clear. */
  coverage: number;
  /** Fill speed. The explainer uses a slower one so you can watch it rise. */
  durationClass?: string;
};

/** The vertical strip with the floor line: soft tint below, green above when clear. */
export function WaterLineTank({ coverage, durationClass = "duration-500" }: WaterLineTankProps) {
  const fill = Math.min(coverage * LINE_AT, 100);
  const belowLine = Math.min(fill, LINE_AT);
  const aboveLine = Math.max(fill - LINE_AT, 0);

  return (
    <div className="relative h-full w-full" aria-hidden>
      {/* Outlined, so the empty part reads as a tank even on a white dialog. */}
      <div className="absolute inset-0 overflow-hidden rounded-full bg-[var(--surface-inset)] ring-1 ring-inset ring-[var(--divider)]">
        <div
          className={`absolute inset-x-0 bottom-0 bg-[var(--accent)]/30 transition-[height] ${durationClass} motion-reduce:transition-none`}
          style={{ height: `${belowLine}%` }}
        />
        {/* Only renders when clear. The soft tint below the line is money
            already spoken for; green above it is money that's free. A
            strong color below would read as an alarm even when you're fine. */}
        <div
          className={`absolute inset-x-0 bg-[var(--ok)] transition-[height] ${durationClass} motion-reduce:transition-none`}
          style={{ bottom: `${LINE_AT}%`, height: `${aboveLine}%` }}
        />
      </div>

      {/* Overhangs both edges so it reads as a threshold drawn across the
          strip, not a band inside it. */}
      <div
        className="absolute -inset-x-1 h-0.5 bg-[var(--text)]"
        style={{ bottom: `${LINE_AT}%` }}
      />
    </div>
  );
}