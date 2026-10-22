import type { LifeVestView } from "../_server/queries";
import { CoveragePanel } from "./coverage-panel";

/** "If nothing changes", once revenue and the floor have loaded. */
export async function CoverageSection({ viewPromise }: { viewPromise: Promise<LifeVestView> }) {
  const { coverage } = await viewPromise;
  return <CoveragePanel {...coverage} />;
}
