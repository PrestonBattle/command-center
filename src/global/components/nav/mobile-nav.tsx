"use client";

import Link from "next/link";
import { APPCONFIG } from "@/global/config/config";
import { useIsActive } from "@/global/hooks/use-is-active";
import Glass from "../glass/glass";

/**
 * Bottom tab bar on phones (below `sm`). Same links as the sidebar, read
 * from APPCONFIG so the two can't drift apart.
 */
export function MobileNav() {
  const isActive = useIsActive();

  return (
    <Glass className="fixed inset-x-3 bottom-3 z-20 rounded-3xl sm:hidden">
      <nav aria-label="Main">
        {/* One column per APPCONFIG.navbar item; update if the list changes. */}
        <ul className="grid grid-cols-6">
          {APPCONFIG.navbar.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-semibold",
                    "focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
                    active ? "text-[var(--accent)]" : "text-[var(--text-muted)]",
                  ].join(" ")}
                >
                  <span aria-hidden>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </Glass>
  );
}
