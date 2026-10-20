"use client";

import { usePathname } from "next/navigation";
import { IconBrain, IconLogout } from "@tabler/icons-react";
import { NavbarLink } from "./link";
import { APPCONFIG } from "@/global/config/config";
import { logout } from "@/app/auth/actions/logout";
import Glass from "../glass/glass";

export function Navbar() {
  const pathname = usePathname();

  if (APPCONFIG.hiddenRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Glass
      className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-56 shrink-0 rounded-3xl sm:block"
    >
      <nav aria-label="Main" className="flex h-full flex-col gap-1 px-3 py-4 ">
        <div className="mb-4 flex items-center gap-2.5 px-3">
          <IconBrain size={22} stroke={1.6} className="shrink-0 text-[var(--accent)]" />
          <p className="whitespace-nowrap font-display text-base font-semibold text-[var(--text)]">
            Command Center
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

        <div className="mt-auto border-t border-black/10 pt-2">
          {/* A form, not a click handler: the server action works without JS
              and keeps auth logic out of the nav. */}
          <form action={logout}>
            <button
              type="submit"
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm
                         text-[var(--text-muted)] transition-colors
                         hover:bg-white/40 hover:text-[#b91c1c]"
            >
              <IconLogout size={18} stroke={1.6} className="shrink-0" />
              Sign out
            </button>
          </form>
        </div>
      </nav>
    </Glass>
  );
}