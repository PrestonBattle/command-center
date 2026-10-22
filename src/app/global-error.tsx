"use client";

import { geist } from "@/global/styles/fonts";
import "@/global/styles/globals.css";
import "@/global/components/glass/style.css";

type Props = { error: Error & { digest?: string }; reset: () => void };

/**
 * Last resort: the root layout itself failed, so this replaces it, <html>
 * included. Nothing from the layout is available (no Mantine provider, no
 * saved theme), so it's plain markup on the default Harbor colors. The
 * button reloads the whole page, since there's no layout to re-render into.
 */
export default function GlobalError({ error }: Props) {
  return (
    // data-mantine-color-scheme is what the theme's color variables key on.
    <html lang="en" data-theme="harbor" data-mantine-color-scheme="light" className={geist.variable}>
      <body>
        <main className="flex min-h-dvh items-center justify-center px-4">
          <div className="glass flex max-w-md flex-col items-center gap-3 rounded-3xl p-10 text-center">
            <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
            <p className="text-[var(--text-muted)]">
              Command Center couldn&apos;t load. Try again in a moment; if it keeps happening, come back in a few
              minutes.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 min-h-11 rounded-lg bg-[var(--accent)] px-5 font-semibold text-[var(--on-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Try again
            </button>
            {error.digest && <p className="text-xs text-[var(--text-muted)]">Reference: {error.digest}</p>}
          </div>
        </main>
      </body>
    </html>
  );
}
