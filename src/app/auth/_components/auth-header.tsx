import { IconBrain } from "@tabler/icons-react";

/** Brand mark plus the page's one <h1>, shared by login and signup. */
export function AuthHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-6 flex flex-col items-center gap-3 text-center">
      <p className="flex items-center gap-2 font-display text-lg font-bold">
        <IconBrain size={24} stroke={1.6} aria-hidden className="text-[var(--accent)]" />
        Command Center
      </p>
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="text-[var(--text-muted)]">{description}</p>
    </header>
  );
}
