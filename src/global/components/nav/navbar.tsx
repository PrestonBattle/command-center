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
      className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-48 shrink-0 flex-col rounded-panel border border-[var(--divider)] bg-[var(--surface)] px-3 py-4 sm:flex"
    >
      <div className="mb-4 flex items-center gap-2.5 px-3">
        <IconBrain size={22} stroke={1.6} className="shrink-0 text-[var(--accent)]" />
        <p className="font-display text-base font-semibold leading-tight text-[var(--text)]">
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
      <div className="mt-auto border-t border-[var(--divider)] pt-2">
        {/* A form, not a click handler — the server action works without JS
            and keeps auth logic out of the nav. */}
        <form action={logout}>
          <button
            type="submit"
            className="group flex w-full items-center gap-3 rounded-lg px-3
                       py-2 text-sm text-[var(--text-muted)] transition-colors
                       hover:bg-[var(--accent)]/8 hover:text-[var(--bad)]"
          >
            <span className="shrink-0 text-[var(--text-faint)] group-hover:text-[var(--bad)]">
              <IconLogout size={18} stroke={1.6} />
            </span>
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}