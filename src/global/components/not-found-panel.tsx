import { GlassPanel } from "./glass/glass-panel";
import { ButtonLink } from "./button-link";

type NotFoundPanelProps = {
  /** Where the button goes. Inside the app that's the dashboard. */
  href?: string;
  linkLabel?: string;
};

/**
 * The 404 page body. Says what happened in plain words -- usually a link to a
 * client that was deleted -- and offers one way back.
 */
export function NotFoundPanel({ href = "/", linkLabel = "Back to dashboard" }: NotFoundPanelProps) {
  return (
    <GlassPanel padding="lg" className="mx-auto mt-10 max-w-md items-center text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">404</p>
      <h1 className="font-display text-3xl font-bold">This page could not be found</h1>
      <p className="text-[var(--text-muted)]">
        It may have been deleted, or the link has a typo.
      </p>
      <ButtonLink href={href} className="mt-2">
        {linkLabel}
      </ButtonLink>
    </GlassPanel>
  );
}
