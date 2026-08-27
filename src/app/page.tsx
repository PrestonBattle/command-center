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
};

export default function Home() {
  return (
    <div className="mx-auto flex flex-col px-4 sm:px-6">
      <style>{`
        .dashboard-grid {
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 1024px) {
          .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 320px;
            grid-template-rows: auto auto 1fr 1fr;
            grid-template-areas:
              "A A B B"
              "A A B B"
              "C C C C";
          }
        }
      `}</style>

      <div className="dashboard-grid">
        <WaterLinePanel {...SAMPLE} style={{ gridArea: "A" }} />
      </div>


    </div>
  );
}
