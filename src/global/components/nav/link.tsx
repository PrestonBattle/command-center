"use client"
import Link from "next/link";

type NavbarLinkProps = {
  label: string;
  href: string;
  active?: boolean;
  leftSection?: React.ReactNode;
  /** Right-aligned count, like Drafts 10. Hidden when 0 or undefined. */
  count?: number;
  /** Indented, no icon — for sub-items under a section header. */
  nested?: boolean;
};

/**
 * No "use client" — this is a Link with no hooks or handlers, so it can
 * render on the server. Only the parent Navbar needs usePathname.
 *
 * The hover icon/label swap is gone: labels are always visible in this
 * layout, so there's nothing to reveal.
 */
export function NavbarLink({
  label,
  href,
  active,
  leftSection,
  count,
  nested = false,
}: NavbarLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-active={active || undefined}
      className={[
        "group flex items-center gap-3 rounded-lg px-3 py-2",
        "text-sm transition-colors",
        nested ? "pl-11" : "",
        active
          ? "bg-purple-100 font-medium text-purple-900"
          : "text-ink-muted hover:bg-purple-50 hover:text-ink",
      ].join(" ")}
    >
      {leftSection && (
        <span
          className={[
            "shrink-0 transition-colors",
            active ? "text-purple-700" : "text-ink-subtle group-hover:text-ink",
          ].join(" ")}
        >
          {leftSection}
        </span>
      )}

      <span className="flex-1 truncate">{label}</span>

      {/* Falsy check, not != undefined — a count of 0 is noise, not news. */}
      {count ? (
        <span
          className={[
            "shrink-0 rounded-md px-1.5 py-0.5 text-xs tabular-nums",
            active
              ? "bg-purple-200 text-purple-900"
              : "bg-purple-50 text-ink-subtle",
          ].join(" ")}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}