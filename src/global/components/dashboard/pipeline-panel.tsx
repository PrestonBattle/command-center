import { getPipeline, money } from "@/app/data";
import { Panel } from "../panel/panel";


/**
 * Expected value, not a lead count. "12 open leads" is a number that only
 * goes up; "$1,814 you might close" is comparable against the gap sitting
 * in the panel above it.
 */
export function PipelinePanel({ style }: { style?: React.CSSProperties }) {
  const { openLeads, closeRate, avgClientMrr } = getPipeline();
  const expected = openLeads * closeRate * avgClientMrr;

  return (
    <Panel plain style={style} className="flex flex-col justify-center">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-subtle">
        Pipeline
      </p>

      {openLeads === 0 ? (
        <p className="text-sm text-ink-subtle">
          No open leads. Nothing in flight to close the gap.
        </p>
      ) : (
        <>
          <p className="text-2xl font-medium leading-tight text-ink">
            {money(expected)}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {openLeads} open leads at your {Math.round(closeRate * 100)}% close
            rate and {money(avgClientMrr)} average.
          </p>
        </>
      )}
    </Panel>
  );
}