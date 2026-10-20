import { BackButton } from "@/global/components/back-button";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { PageHeader } from "@/global/components/layout";
import { NewClientForm } from "./_components/new-client-form";

/** Add one client with what they pay. More services and contacts go on their page. */
export default function NewClientPage() {
  return (
    <GlassPanel padding="lg" className="max-w-2xl">
      <PageHeader title="Add a client" description="Start with what they pay. You can add contacts and more services after." />
      <NewClientForm back={<BackButton href="/clients" text="Clients" />} />
    </GlassPanel>
  );
}
