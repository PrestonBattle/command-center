"use client";

import { use } from "react";
import type { LifeVestView } from "../_server/queries";
import { FloorEditor } from "./floor-editor";

/** The costs form, once the saved costs have loaded. A client section: it's a form. */
export function FloorSection({ viewPromise }: { viewPromise: Promise<LifeVestView> }) {
  const { floorValues } = use(viewPromise);
  return <FloorEditor initialValues={floorValues} />;
}
