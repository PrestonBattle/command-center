import { MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Background } from "@/global/components/background";
import { geist } from "@/global/styles/fonts";
import "@/global/styles/globals.css";
import { THEME_COOKIE, toThemeId } from "@/global/lib/themes";
import { theme } from "@/global/styles/mantine-theme";

export const metadata: Metadata = {
  title: "Command Center",
  description: "Your business at a glance: clients, money in, and your monthly floor.",
};

/**
 * Root layout: providers, fonts, the background and the color theme only. Navigation and the
 * auth/onboarding gate live in (app)/layout.tsx, so /auth and /onboarding
 * render without them.
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The theme is set on the server, from a cookie, so the first paint is
  // already in the right colors. A client-side switch would flash the default theme
  // on every page load.
  const colorTheme = toThemeId((await cookies()).get(THEME_COOKIE)?.value);

  return (
    // No ColorSchemeScript: the app is light-only, and mantineHtmlProps
    // already sets data-mantine-color-scheme="light" on the server. The script
    // only matters for user-chosen schemes, and React 19 warns about it
    // whenever the root layout re-renders on the client (e.g. a 404).
    // The font variable goes on <html>, not <body>: Mantine and Tailwind
    // define their font variables on :root, and a variable set lower down
    // isn't visible there, which left body text in the system font.
    <html lang="en" data-theme={colorTheme} className={geist.variable} {...mantineHtmlProps}>
      <body>
        <MantineProvider theme={theme} forceColorScheme="light">
          <Notifications position="top-right" />
          <Background />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
