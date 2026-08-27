type WaterLineTankProps = {
  /** revenue / floor. 0.71 is 71%. Above 1 means clear. */
  coverage: number;
  height?: number;
};

/**
 * The floor line sits at 70% of the container height, not at the top —
 * that leaves 30% of headroom for margin to render above it. The tank
 * therefore tops out around 143% of the floor; past that the fill pins,
 * which is fine since someone at that point doesn't need this panel.
 */
const LINE_AT = 70;

export function WaterLineTank({ coverage, height = 250 }: WaterLineTankProps) {
  const fill = Math.min(coverage * LINE_AT, 100);
  const belowLine = Math.min(fill, LINE_AT);
  const aboveLine = Math.max(fill - LINE_AT, 0);

  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 overflow-hidden rounded-lg bg-paper-dim">
        <div
          className="absolute inset-x-0 bottom-0 bg-purple-400 transition-[height] duration-500"
          style={{ height: `${belowLine}%` }}
        />
        {/* Only renders when clear. Purple is money doing a job; teal is
            money that's free. */}
        <div
          className="absolute inset-x-0 bg-positive transition-[height] duration-500"
          style={{ bottom: `${LINE_AT}%`, height: `${aboveLine}%` }}
        />
      </div>

      {/* Extends past the tank on both sides so it reads as a threshold
          drawn across the fill, not a band inside it. */}
      <div
        className="absolute -inset-x-1.5 h-0.5 bg-ink"
        style={{ bottom: `${LINE_AT}%` }}
      />
    </div>
  );
}