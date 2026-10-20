import { IconLogout } from "@tabler/icons-react";
import { logout } from "@/app/auth/actions/logout";

/**
 * A form, not a click handler: the server action works without JavaScript
 * and keeps auth logic out of the nav.
 */
export function SignOutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        aria-label={compact ? "Sign out" : undefined}
        className="group flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm
                   text-[var(--text-muted)] transition-colors hover:bg-[var(--accent)]/8
                   hover:text-[var(--bad)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      >
        <IconLogout size={18} stroke={1.6} aria-hidden className="shrink-0" />
        {!compact && "Sign out"}
      </button>
    </form>
  );
}
