import Link from "next/link";
import { Stat } from "@/global/components/layout";
import { formatCents } from "@/global/lib/money";
import { DASHBOARD_TIPS } from "../_lib/explanations";
import type { BusinessView, PipelineView } from "../_server/queries";

type Props = {
  businessPromise: Promise<BusinessView>;
  pipelinePromise: Promise<PipelineView>;
};

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** The three compact stats across the top: collected, overdue, pipeline. */
export async function DashboardStats({ businessPromise, pipelinePromise }: Props) {
  const [business, pipeline] = await Promise.all([businessPromise, pipelinePromise]);
  const overdueCents = business.overdue.reduce((t, r) => t + r.amountCents, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Stat
        compact
        label="Collected this month"
        info={DASHBOARD_TIPS.collected}
        value={formatCents(business.totals.paidCents)}
        hint={`of ${formatCents(business.totals.expectedCents)} expected`}
      />
      <Stat
        compact
        label="Overdue"
        info={DASHBOARD_TIPS.overdue}
        value={formatCents(overdueCents)}
        hint={
          business.overdue.length ? (
            <Link href="/money" className="underline">{`${plural(business.overdue.length, "payment")} to chase`}</Link>
          ) : (
            "All caught up"
          )
        }
      />
      <Stat
        compact
        label="Pipeline"
        info={DASHBOARD_TIPS.pipeline}
        value={`${formatCents(pipeline.pipelineCents)}/mo`}
        hint={<Link href="/leads" className="underline">{plural(pipeline.openCount, "open lead")}</Link>}
      />
    </div>
  );
}
