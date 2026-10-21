import { ButtonLink } from "@/global/components/button-link";

/**
 * The Snapshot before a floor is set. Without a floor there's nothing to
 * measure revenue against, so instead of a meaningless "0% of what you
 * need" it says what the floor is and where to set it.
 */
export function SnapshotEmpty() {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-display text-2xl font-bold">Set your floor to see your Snapshot</p>
      <p className="text-sm text-[var(--text-muted)]">
        Your floor is what the business needs each month to cover your life, the business and taxes. Add your costs and
        this shows how far revenue is above or below it.
      </p>
      <ButtonLink href="/life-vest" className="mt-2 self-start">
        Set up Life vest
      </ButtonLink>
    </div>
  );
}
