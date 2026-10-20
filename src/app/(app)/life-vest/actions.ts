"use server";

import { revalidatePath } from "next/cache";
import { getDataLayer } from "@/global/data";
import { invalid, type ActionResult } from "@/global/lib/action-result";
import { attempt } from "@/global/lib/attempt";
import { saveFloorData } from "@/global/lib/save-floor";
import { floorSchema } from "@/global/lib/schemas/floor";

/** Saves edited expenses, tax rate and estimate. Same write as onboarding step 2. */
export async function updateFloor(input: unknown): Promise<ActionResult> {
  const parsed = floorSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const failed = await attempt("life-vest:update-floor", async () => {
    await saveFloorData(await getDataLayer(), parsed.data);
  });
  if (failed) return failed;
  revalidatePath("/life-vest");
  revalidatePath("/");
  return { ok: true };
}
