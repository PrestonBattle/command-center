
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
        {/* forceColorScheme="light" because the gradient IS the dark
            surface. Letting Mantine flip to dark gives you dark text on
            dark cards inside the cream panels. */}
        <MantineProvider theme={theme} forceColorScheme="light">
          <Notifications />
          <Background />
          {/* No <main> here -- (app)/layout.tsx supplies it, and nesting
              two gives you duplicate landmarks. No overflow-hidden either,
              or the content sheet can't scroll. */}
          <div id="inner-body" className="relative z-10">
            <Navbar />
            {children}
          </div>
          
        </MantineProvider>
      </body>
    </html>
  );
}