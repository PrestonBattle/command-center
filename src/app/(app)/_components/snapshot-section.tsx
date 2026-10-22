import { WaterLinePanel } from "@/global/components/dashboard/watertank/waterline-panel";
import type { BusinessView } from "../_server/queries";

/** The Snapshot once the money has loaded. */
export async function SnapshotSection({ businessPromise }: { businessPromise: Promise<BusinessView> }) {
  const { snapshot } = await businessPromise;
  return <WaterLinePanel {...snapshot} />;
}
