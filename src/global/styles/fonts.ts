import { Geist } from "next/font/google";

/**
 * The app's one typeface, for body text and headings alike. Geist is a
 * variable font, so every weight comes from a single file (the old
 * Bricolage + Reddit Sans pair loaded 23). Its figures are clean at small
 * sizes, which matters in a money app; columns of amounts use
 * `tabular-nums` so the digits line up.
 */
export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
