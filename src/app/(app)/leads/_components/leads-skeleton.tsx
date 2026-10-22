import { SkeletonLine, SkeletonRegion } from "@/global/components/skeleton";
import { LEAD_STAGES } from "@/global/lib/lead-stages";

/**
 * The board in loading state: the real stage names (they never change) with
 * two placeholder cards each, at the board's height. On a phone, the stage
 * picker and the first column, like the real board.
 */
export function LeadsSkeleton() {
  return (
    <SkeletonRegion label="leads" className="flex flex-col gap-3">
      <SkeletonLine width="w-72" height="h-9" className="rounded-xl md:hidden" />
      <div className="flex flex-col gap-4 md:h-[calc(100dvh-15.5rem)] md:min-h-96 md:flex-row">
        {LEAD_STAGES.map((s, i) => (
          <div
            key={s.value}
            className={`min-w-0 flex-col gap-3 rounded-3xl border border-[var(--divider)] bg-[var(--surface-inset)] px-3 pb-3 md:min-w-44 md:flex-1 ${i === 0 ? "flex" : "hidden md:flex"}`}
          >
            <div className="px-1 pt-3">
              <p aria-hidden className="text-sm font-bold">{s.label}</p>
              <SkeletonLine width="w-16" height="h-3" className="mt-1.5" />
            </div>
            {[0, 1].map((card) => (
              <div key={card} className="flex flex-col gap-3 rounded-2xl border border-[var(--divider)] p-4">
                <SkeletonLine width={card ? "w-20" : "w-24"} height="h-4" />
                <SkeletonLine width="w-28" height="h-6" />
                <SkeletonLine width="w-32" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}
