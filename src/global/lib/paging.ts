/** One page of a list, and where it sits in the whole. */
export type Page<T> = {
  items: T[];
  /** 1-based, clamped to the pages that exist. */
  page: number;
  pageCount: number;
  total: number;
  /** 1-based positions of the first and last item shown ("51–100 of 400"). */
  from: number;
  to: number;
};

/**
 * ?page= → a page number. Anything that isn't a positive whole number is
 * page 1, so a mistyped or stale link still shows something.
 */
export function parsePage(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/**
 * Cuts one page out of a list. A page past the end shows the last page
 * rather than an empty one (a search that narrowed the list while you were
 * on page 5, say).
 */
export function paginate<T>(items: T[], page: number, perPage: number): Page<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * perPage;
  const shown = items.slice(start, start + perPage);
  return {
    items: shown,
    page: current,
    pageCount,
    total,
    from: total ? start + 1 : 0,
    to: start + shown.length,
  };
}

/** The URL for another page of the same list, keeping the other params. */
export function pageHref(pathname: string, params: Record<string, string | undefined>, page: number): string {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value && key !== "page") next.set(key, value);
  if (page > 1) next.set("page", String(page));
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
