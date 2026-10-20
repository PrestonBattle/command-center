import Link from "next/link";
import { BackButton } from "@/global/components/back-button";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { PageHeader } from "@/global/components/layout";

/** One tile on the dev index, linking to a component's showcase page. */
type ShowcaseCard = {
  /** Route of the showcase page, e.g. "/dev/table" (create the folder to match). */
  href: string;
  /** What's being shown off, e.g. "Table component". */
  title: string;
  /** One line on what the component does. */
  description: string;
};

const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    href: "/dev/components",
    title: "Components",
    description: "Inputs, layout blocks, badges, stepper and the floor form",
  },
  {
    href: "/dev/panel",
    title: "Glass panel",
    description: "GlassPanel variants with sample data",
  },
];

/** Dev-only index of component showcases. 404s in production (see layout). */
export default function DevPage() {
  return (
    <div className="flex flex-col gap-6">
      <BackButton href="/" text="Home" className="self-start" />
      <PageHeader title="Dev showcases" description="Component demos and development tools." />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SHOWCASE_CARDS.map((card) => (
          <li key={card.href}>
            <GlassPanel className="relative h-full focus-within:ring-2 focus-within:ring-[var(--accent)]">
              <Link href={card.href} className="font-display text-xl font-bold outline-none after:absolute after:inset-0">
                {card.title}
              </Link>
              <p className="text-sm text-[var(--text-muted)]">{card.description}</p>
            </GlassPanel>
          </li>
        ))}
      </ul>
    </div>
  );
}
