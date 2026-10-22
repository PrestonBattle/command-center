import { attentionItems } from "../_lib/attention";
import type { BusinessView, PipelineView } from "../_server/queries";
import { AttentionPanel } from "./attention-panel";

type Props = {
  businessPromise: Promise<BusinessView>;
  pipelinePromise: Promise<PipelineView>;
  className?: string;
};

/** Needs attention once both the money and the leads have loaded. */
export async function AttentionSection({ businessPromise, pipelinePromise, className }: Props) {
  const [business, pipeline] = await Promise.all([businessPromise, pipelinePromise]);
  const items = attentionItems({
    overdue: business.overdue,
    staleLeads: pipeline.staleLeads,
    floorCents: business.floorCents,
    clientCount: business.clientCount,
  });
  return <AttentionPanel className={className} items={items} />;
}
