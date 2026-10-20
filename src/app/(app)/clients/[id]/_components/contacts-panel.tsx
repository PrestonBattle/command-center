import { GlassPanel } from "@/global/components/glass/glass-panel";
import { EmptyState, StatusBadge } from "@/global/components/layout";
import type { ContactRow } from "@/global/types/supabase/types";
import { AddContactForm } from "./add-contact-form";

/** People at the client. The primary contact is listed first. */
export function ContactsPanel({ clientId, contacts }: { clientId: string; contacts: ContactRow[] }) {
  const sorted = [...contacts].sort((a, b) => Number(b.is_primary) - Number(a.is_primary));
  return (
    <GlassPanel title="Contacts">
      {sorted.length === 0 ? (
        <EmptyState title="No contacts yet" description="Who do you talk to there?" />
      ) : (
        <ul className="flex flex-col">
          {sorted.map((c) => (
            <li key={c.id} className="flex flex-wrap items-start gap-3 border-t border-[var(--divider)] py-3 first:border-t-0">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {c.name}
                  {c.role && <span className="font-normal text-[var(--text-muted)]"> · {c.role}</span>}
                </p>
                <div className="flex flex-col text-sm">
                  {c.email && <a href={`mailto:${c.email}`} className="text-[var(--text-muted)] hover:underline">{c.email}</a>}
                  {c.phone && <a href={`tel:${c.phone}`} className="text-[var(--text-muted)] hover:underline">{c.phone}</a>}
                </div>
              </div>
              {c.is_primary && <StatusBadge tone="neutral">Primary</StatusBadge>}
            </li>
          ))}
        </ul>
      )}
      <AddContactForm clientId={clientId} />
    </GlassPanel>
  );
}
