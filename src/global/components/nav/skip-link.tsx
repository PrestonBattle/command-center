/**
 * Invisible until focused: the first Tab on any page offers to jump past
 * the navigation, so keyboard and screen-reader users don't tab through
 * every nav link on every page.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-xl bg-[var(--accent)] px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to content
    </a>
  );
}
