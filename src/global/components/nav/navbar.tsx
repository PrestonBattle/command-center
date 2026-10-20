"use client";

import { IconBrain } from "@tabler/icons-react";
import { APPCONFIG } from "@/global/config/config";
import { useIsActive } from "@/global/hooks/use-is-active";
import Glass from "../glass/glass";
import { NavbarLink } from "./link";
import { SignOutButton } from "./sign-out-button";

/** Desktop sidebar. Hidden below `sm`, where MobileNav takes over. */
export function Navbar() {
  const isActive = useIsActive();

  return (
    <Glass className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-56 shrink-0 rounded-3xl sm:block">
      <nav aria-label="Main" className="flex h-full flex-col gap-1 px-3 py-4">
        <div className="mb-4 flex items-center gap-2.5 px-3">
          <IconBrain size={22} stroke={1.6} aria-hidden className="shrink-0 text-[var(--accent)]" />
          <p className="whitespace-nowrap font-display text-base font-bold">Command Center</p>
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
          <SignOutButton />
        </div>
      </nav>
    </Glass>
  );
}
