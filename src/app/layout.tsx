
import { Background } from "@/global/components/background";
import { Navbar } from "@/global/components/nav/navbar";
import { bricolageGrotesque, redditSans } from "@/global/styles/fonts";
import "@/global/styles/globals.css";
import { theme } from "@/global/styles/mantine-theme";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command Center",
  description: "Small business command center",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body
        className={`relative ${bricolageGrotesque.variable} ${redditSans.variable}`}
      >
        <MantineProvider theme={theme} forceColorScheme="light">
          <Notifications />
          <Background />
          <div className="relative z-10 flex gap-3 p-3 sm:p-4">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>

        </MantineProvider>
      </body>
    </html>
  );
}