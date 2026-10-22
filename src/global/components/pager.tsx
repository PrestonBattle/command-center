import { Button } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { ButtonLink } from "./button-link";

type PagerProps = {
  page: number;
  pageCount: number;
  /** "51–100 of 400 clients". */
  summary: string;
  /** Links for the neighbouring pages; built with `pageHref`. */
  prevHref: string;
  nextHref: string;
};

/**
 * Previous / Next under a long list, with where you are in words. Plain
 * links, so every page has a URL you can share or come back to. At either
 * end the button stays (disabled) so the layout doesn't shift.
 */
export function Pager({ page, pageCount, summary, prevHref, nextHref }: PagerProps) {
  if (pageCount <= 1) return null;
  const prev = <IconChevronLeft size={18} aria-hidden />;
  const next = <IconChevronRight size={18} aria-hidden />;

  return (
    <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-[var(--text-muted)]">
        Page {page} of {pageCount} · {summary}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <ButtonLink href={prevHref} variant="subtle" color="ink" leftSection={prev}>
            Previous
          </ButtonLink>
        ) : (
          <Button variant="subtle" color="ink" leftSection={prev} disabled>
            Previous
          </Button>
        )}
        {page < pageCount ? (
          <ButtonLink href={nextHref} variant="subtle" color="ink" rightSection={next}>
            Next
          </ButtonLink>
        ) : (
          <Button variant="subtle" color="ink" rightSection={next} disabled>
            Next
          </Button>
        )}
      </div>
    </nav>
  );
}
