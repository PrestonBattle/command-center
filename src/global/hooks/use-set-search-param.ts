"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Returns `setParam(key, value)` for filters that live in the URL
 * (?q=, ?status=). Keeps the other params, drops the key when the value is
 * empty or "all", and replaces history instead of pushing, so Back leaves
 * the page rather than undoing each keystroke.
 */
export function useSetSearchParam() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
}
