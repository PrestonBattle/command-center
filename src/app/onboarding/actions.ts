"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDataLayer, type DataLayer } from "@/global/data";
import { invalid, type ActionResult } from "@/global/lib/action-result";
import { attempt } from "@/global/lib/attempt";
import { createClientsWithServices } from "@/global/lib/create-clients";
import { todayIso } from "@/global/lib/dates";
import { saveFloorData } from "@/global/lib/save-floor";
import { floorSchema } from "@/global/lib/schemas/floor";
import { businessSchema, clientsSchema } from "./_lib/schemas";
import { pathForStep } from "./_lib/steps";

/*
 * Onboarding server actions. Each: validate → data layer → write inside
 * attempt() → redirect to the next step. redirect() stays outside attempt()
 * because it works by throwing.
 */

/**
 * Next.js keeps a layout mounted across navigations, so the progress bar
 * would keep showing the step from the first page load. Revalidating the
 * onboarding layout makes it re-read onboarding_step after every save.
 */
function goTo(path: string): never {
  revalidatePath("/onboarding", "layout");
  redirect(path);
}

/** Only move forward: going back to edit an earlier step keeps progress. */
async function stepAfter(dl: DataLayer, step: number): Promise<number> {
  const org = await dl.org.get();
  return Math.max(org.onboarding_step, step + 1);
}

/** Step 1: business name, type and timezone. */
export async function saveBusiness(input: unknown): Promise<ActionResult> {
  const parsed = businessSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const dl = await getDataLayer();
  const failed = await attempt("onboarding:business", async () => {
    await dl.org.update({ ...parsed.data, onboarding_step: await stepAfter(dl, 1) });
  });
  if (failed) return failed;
  goTo(pathForStep(2));
}

/** Step 2: monthly expenses, tax set-aside and revenue estimate. */
export async function saveFloor(input: unknown): Promise<ActionResult> {
  const parsed = floorSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const dl = await getDataLayer();
  const failed = await attempt("onboarding:floor", async () => {
    await saveFloorData(dl, parsed.data, { onboarding_step: await stepAfter(dl, 2) });
  });
  if (failed) return failed;
  goTo(pathForStep(3));
}

/** Step 2, "Finish later": move on without saving. Life vest can fill it in. */
export async function skipFloor(): Promise<ActionResult> {
  const dl = await getDataLayer();
  const failed = await attempt("onboarding:skip-floor", async () => {
    await dl.org.update({ onboarding_step: await stepAfter(dl, 2) });
  });
  if (failed) return failed;
  goTo(pathForStep(3));
}

/** Step 3: the client list, typed or imported. An empty list skips the step. */
export async function saveClients(input: unknown): Promise<ActionResult> {
  const parsed = clientsSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const dl = await getDataLayer();
  const failed = await attempt("onboarding:clients", async () => {
    const org = await dl.org.get();
    await createClientsWithServices(dl, parsed.data.clients, todayIso(org.timezone));
    await dl.org.update({ onboarding_step: Math.max(org.onboarding_step, 4) });
  });
  if (failed) return failed;
  goTo(pathForStep(4));
}

/** Step 4: mark onboarding finished and open the dashboard. */
export async function finishOnboarding(): Promise<ActionResult> {
  const dl = await getDataLayer();
  const failed = await attempt("onboarding:finish", async () => {
    await dl.org.update({ onboarding_step: 4, onboarding_completed_at: new Date().toISOString() });
  });
  if (failed) return failed;
  revalidatePath("/", "layout");
  redirect("/");
}
