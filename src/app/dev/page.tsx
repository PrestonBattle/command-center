
import { BackButton } from "@/global/components/back-button";
import { Text, Title } from "@mantine/core";
import Link from "next/link";

interface showcase_card {
  href: string, //link to dev page - create corresponding folders for componet example: dev/table
  title: string, //title of your feature testing - example: table component
  description: string, //description of your feature - example: a new table component that displays table information
}

const SHOWCASE_CARDS = [
  {

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
