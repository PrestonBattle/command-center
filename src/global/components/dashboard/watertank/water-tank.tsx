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
};

export function WaterLineTank({ coverage }: WaterLineTankProps) {
  const fill = Math.min(coverage * LINE_AT, 100);
  const belowLine = Math.min(fill, LINE_AT);
  const aboveLine = Math.max(fill - LINE_AT, 0);

  return (
    <div className="relative h-full w-full" aria-hidden>
      <div className="absolute inset-0 overflow-hidden rounded-full bg-paper-dim">
        <div
          className="absolute inset-x-0 bottom-0 bg-purple-700 transition-[height] duration-500"
          style={{ height: `${belowLine}%` }}
        />
        {/* Only renders when clear. Purple is money doing a job; teal is
            money that's free. */}
        <div
          className="absolute inset-x-0 bg-positive transition-[height] duration-500"
          style={{ bottom: `${LINE_AT}%`, height: `${aboveLine}%` }}
        />
      </div>

      {/* Overhangs both edges so it reads as a threshold drawn across the
          strip, not a band inside it. */}
      <div
        className="absolute -inset-x-1 h-0.5 bg-ink"
        style={{ bottom: `${LINE_AT}%` }}
      />
    </div>
  );
}