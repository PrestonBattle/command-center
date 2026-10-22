"use client";

import { use } from "react";
import type { LifeVestView } from "../_server/queries";
import { WhatIfPanel } from "./what-if-panel";

/** "What if…", once loaded. A client section: its sliders and picker are interactive. */
export function WhatIfSection({ viewPromise }: { viewPromise: Promise<LifeVestView> }) {
  const { whatIf } = use(viewPromise);
  return <WhatIfPanel {...whatIf} />;
}
