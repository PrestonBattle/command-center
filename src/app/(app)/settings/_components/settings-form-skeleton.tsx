import { SkeletonLine, SkeletonPanel } from "@/global/components/skeleton";

type Props = { title: string; label: string; fields: number };

/** A Settings panel in loading state: its real title and one bar per field. */
export function SettingsFormSkeleton({ title, label, fields }: Props) {
  return (
    <SkeletonPanel title={title} label={label}>
      <div className="flex flex-col gap-4">
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <SkeletonLine width="w-28" height="h-3.5" />
            <SkeletonLine height="h-12" className="rounded-lg" />
          </div>
        ))}
        <SkeletonLine width="w-32" height="h-11" className="self-end rounded-lg" />
      </div>
    </SkeletonPanel>
  );
}
