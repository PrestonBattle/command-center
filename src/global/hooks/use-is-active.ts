"use client";

import { usePathname } from "next/navigation";

/**
 * Returns a function that says whether a nav href is the current section.
 * "/" only matches exactly; every other href also matches its sub-pages,
 * so /clients/123 keeps "Clients" highlighted.
 */
export function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}
