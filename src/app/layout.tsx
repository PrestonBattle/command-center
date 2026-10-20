import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { Metadata } from "next";
import { Background } from "@/global/components/background";
import { bricolageGrotesque, redditSans } from "@/global/styles/fonts";
import "@/global/styles/globals.css";
import { theme } from "@/global/styles/mantine-theme";

export const metadata: Metadata = {
  title: "Command Center",
  description: "Your business at a glance: clients, money in, and your monthly floor.",
};

/**
 * Root layout: providers, fonts and the background only. Navigation and the
 * auth/onboarding gate live in (app)/layout.tsx, so /auth and /onboarding
 * render without them.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={`${bricolageGrotesque.variable} ${redditSans.variable}`}>
        <MantineProvider theme={theme} forceColorScheme="light">
          <Notifications position="top-right" />
          <Background />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
