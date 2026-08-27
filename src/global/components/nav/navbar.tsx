"use client";

import { usePathname } from "next/navigation";
import { NavbarLink } from "./link";
import { APPCONFIG } from "@/global/config/config";
import { IconBrain, IconLogout } from "@tabler/icons-react";
import { logout } from "@/app/auth/actions/logout";

export function Navbar() {

  const pathname = usePathname();

  if (APPCONFIG.hiddenRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Main"
      className="fixed left-3 top-3 bottom-3 z-50 hidden w-48 flex-col justify-start gap-1 rounded-panel border border-purple-800/20 bg-paper px-3 py-4 sm:flex"
    >
      <div className="mb-4 flex items-center gap-2.5 px-3">
        <IconBrain size={22} stroke={1.6} className="shrink-0 text-purple-700" />
        <p className="font-display text-base font-semibold leading-tight text-ink">
          Command
          <br />
          Center
        </p>
      </div>
      {APPCONFIG.navbar.map((link) => (
        <NavbarLink
          key={link.href}
          href={link.href}
          label={link.label}
          leftSection={link.icon}
          active={isActive(link.href)}
        />
      ))}
      <div className="mt-auto border-t border-paper-edge pt-2">
        {/* A form, not a click handler — the server action works without JS
            and keeps auth logic out of the nav. */}
        <form action={logout}>
          <button
            type="submit"
            className="group flex w-full items-center gap-3 rounded-lg px-3
                       py-2 text-sm text-ink-muted transition-colors
                       hover:bg-purple-50 hover:text-negative"
          >
            <span className="shrink-0 text-ink-subtle group-hover:text-negative">
              <IconLogout size={18} stroke={1.6} />
            </span>
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}