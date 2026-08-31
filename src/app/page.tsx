import { MoneyArrivingPanel } from "@/global/components/dashboard/money-arriving-panel";
import { NeedsAttentionPanel } from "@/global/components/dashboard/needs-attention-panel";
import { PipelinePanel } from "@/global/components/dashboard/pipeline-panel";
import { WaterLinePanel } from "@/global/components/dashboard/watertank/waterline-panel";
import { Stack } from "@mantine/core";
import Image from "next/image";

// Placeholder — swap for the Life Vest snapshot and summed MRR once the
// tables exist. Keeping it in one object here means the page body won't
// change when it becomes a query.
const SAMPLE = {
  personal: 2700,
  business: 850,
  taxRate: 28,
  revenue: 3280,
  topClientName: "Riverside Dental",
  topClientMrr: 1340,
};

export default function Home() {
  return (
    <div className="mx-auto flex flex-col px-4 sm:px-6">
      <header className="mb-4 px-1">
        {/* text-paper, not text-ink — this sits on the gradient, not on a
            panel. Dark ink here is nearly invisible. */}
        <h1 className="font-display text-2xl font-bold text-paper">
          Welcome back, User
        </h1>
        <p className="mt-0.5 text-sm text-paper/70">
          Here&apos;s where things stand this month.
        </p>
      </header>
      <style>{`
.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .dashboard-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    /* Every area must be a rectangle -- an L-shape silently invalidates
       the whole declaration and drops all the area names. */
    grid-template-areas:
      "A A A B"
      "A A A B"
      "C D D D";
  }
}
      `}</style>

      <div className="dashboard-grid">
        <WaterLinePanel {...SAMPLE} style={{ gridArea: "A" }} />
        <MoneyArrivingPanel style={{ gridArea: "B" }} />
        <PipelinePanel style={{ gridArea: "C" }} />
        <NeedsAttentionPanel style={{ gridArea: "D" }} />
      </div>


    </div>
  );
}
