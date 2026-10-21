"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { invalid, type ActionResult } from "@/global/lib/action-result";
import { THEME_COOKIE } from "@/global/lib/themes";
import { themeSchema } from "./_lib/schemas";

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
