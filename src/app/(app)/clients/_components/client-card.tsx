import Link from "next/link";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { StatusBadge } from "@/global/components/layout";
import { clientStatusMeta } from "@/global/lib/client-status";
import { formatCents } from "@/global/lib/money";
import type { ClientSummary } from "../_lib/client-summaries";

/** First letters of the first two words: "Harbor Dental" → "HD". */
const initials = (name: string) =>
  name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

/**
 * One client in the grid. The name is the link and its ::after stretches
 * over the whole card, so the card is clickable while the email and phone
 * stay separate links above it (z-10).
 */
export function ClientCard({ client }: { client: ClientSummary }) {
  const status = clientStatusMeta(client.status);
  return (
    <li>
      <GlassPanel padding="sm" className="relative h-full gap-4 p-5 transition-transform focus-within:ring-2 focus-within:ring-[var(--accent)] hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] font-bold text-white">
            {initials(client.name)}
          </span>
          <div className="min-w-0 flex-1">
            <Link href={`/clients/${client.id}`} className="block truncate text-lg font-bold outline-none after:absolute after:inset-0 after:rounded-3xl">
              {client.name}
            </Link>
          </div>
          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
        </div>
        <p className="font-display text-2xl font-bold tabular-nums">
          {formatCents(client.monthlyCents)}
          <span className="font-sans text-sm font-medium text-[var(--text-muted)]"> /mo</span>
        </p>
        {(client.email || client.phone) && (
          <div className="relative z-10 flex flex-col gap-0.5 text-sm">
            {client.email && <a href={`mailto:${client.email}`} className="truncate text-[var(--text-muted)] hover:underline">{client.email}</a>}
            {client.phone && <a href={`tel:${client.phone}`} className="text-[var(--text-muted)] hover:underline">{client.phone}</a>}
          </div>
        )}
      </GlassPanel>
    </li>
  );
}
