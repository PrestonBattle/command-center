"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getDataLayer } from "@/global/data";
import { invalid, type ActionResult } from "@/global/lib/action-result";
import { attempt } from "@/global/lib/attempt";
import { THEME_COOKIE } from "@/global/lib/themes";
import { businessSettingsSchema, profileSchema, themeSchema } from "./_lib/schemas";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Remembers the color theme for this device. A cookie, not a database
 * column: it's a per-device look (someone may want night on their phone and
 * light at their desk), and the root layout can read it before first paint.
 * No getDataLayer() and no attempt(): nothing here touches the database.
 */
export async function setTheme(input: unknown): Promise<ActionResult> {
  const parsed = themeSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  (await cookies()).set(THEME_COOKIE, parsed.data.theme, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });

  // The root layout holds data-theme; re-render it so server and browser agree.
  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Business name, type and timezone. Revalidates the whole app: the name and
 * timezone show up everywhere (greeting, "today", due and overdue dates).
 */
export async function saveBusinessSettings(input: unknown): Promise<ActionResult> {
  const parsed = businessSettingsSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const dl = await getDataLayer();
  const failed = await attempt("settings:business", async () => {
    await dl.org.update(parsed.data);
  });
  if (failed) return failed;

  revalidatePath("/", "layout");
  return { ok: true };
}

/** Your own name and phone. A blank phone clears it. */
export async function saveProfile(input: unknown): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const dl = await getDataLayer();
  const failed = await attempt("settings:profile", async () => {
    await dl.members.updateSelf({ ...parsed.data, phone: parsed.data.phone ?? null });
  });
  if (failed) return failed;

  revalidatePath("/", "layout");
  return { ok: true };
}
