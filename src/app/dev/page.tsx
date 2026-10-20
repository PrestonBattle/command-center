
import { BackButton } from "@/global/components/back-button";
import Glass from "@/global/components/glass/glass";
import { Text, Title } from "@mantine/core";
import Link from "next/link";

/** One tile on the dev index, linking to a component's showcase page. */
type ShowcaseCard = {
  /** Route of the showcase page, e.g. "dev/table" (create the folder to match). */
  href: string;
  /** What's being shown off, e.g. "Table component". */
  title: string;
  /** One line on what the component does. */
  description: string;
};

const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    href: "dev/panel",
    title: "Glass Panel",
    description: "A panel with a glass look"
  }
];

export default function DevPage() {
  return (
    <div className="w-full p-8 grid">
      <BackButton href="/" text="Home" />
      <Title order={1} className="text-white">
        Dev Showcases
      </Title>
      <Text c="gray.4" mb="xl">
        Component demos and development tools.
      </Text>
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-6">
        {SHOWCASE_CARDS.map((card) => (
          <Link key={card.href} href={card.href}>
            <Glass className="h-40 p-6 block">
              <Title order={4} mb="sm" className="text-white">
                {card.title}
              </Title>
              <Text size="sm" c="gray.2" lineClamp={3}>
                {card.description}
              </Text>
            </Glass>
          </Link>
        ))}
      </div>
    </div>
  );
}
