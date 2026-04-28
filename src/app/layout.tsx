import { Background } from "@/global/components/background";
import { bricolageGrotesque, redditSans } from "@/global/styles/fonts";
import "@/global/styles/globals.css";
import { theme } from "@/global/styles/mantine-theme";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: 'Command Center',
  description: 'Small business command center',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`relative ${bricolageGrotesque.variable} ${redditSans.variable}`}
      >
        <MantineProvider theme={theme}>
            <Notifications />
            <Background />
            <div id="inner-body" className="relative z-10 flex flex-col overflow-hidden">
              <main className="flex-1">{children}</main>
            </div>
        </MantineProvider>
      </body>
    </html>
  );
}