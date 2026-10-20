import { GlassPanel } from "@/global/components/glass/glass-panel";
import { EmptyState, StatusBadge } from "@/global/components/layout";
import { isServiceActive, monthlyCents } from "@/global/lib/billing";
import { formatShortDate } from "@/global/lib/dates";
import { intervalLabel } from "@/global/lib/intervals";
import { formatCents } from "@/global/lib/money";
import type { ClientServiceRow } from "@/global/types/supabase/types";
import { AddServiceForm } from "./add-service-form";
import { EndServiceButton } from "./end-service-button";

type Props = { clientId: string; services: ClientServiceRow[]; today: string };

/** What the client pays for, with the monthly total and a way to add more. */
export function ServicesPanel({ clientId, services, today }: Props) {
  const active = services.filter((s) => isServiceActive(s, today));
  const total = active.reduce((t, s) => t + monthlyCents(s), 0);

  return (
    <GlassPanel title="Services" actions={<span className="font-display text-xl font-bold tabular-nums">{formatCents(total)}/mo</span>}>
      {services.length === 0 ? (
        <EmptyState title="No services yet" description="Add what they pay for and how often." />
      ) : (
        <ul className="flex flex-col">
          {services.map((s) => {
            const running = isServiceActive(s, today);
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 border-t border-[var(--divider)] py-3 first:border-t-0">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {formatCents(s.amount_cents)} · {intervalLabel(s.interval_months)} · since {formatShortDate(s.started_on)}
                  </p>
                </div>
                {running ? (
                  <EndServiceButton serviceId={s.id} clientId={clientId} serviceName={s.name} />
                ) : (
                  <StatusBadge tone="neutral">{s.ended_on ? `Ended ${formatShortDate(s.ended_on)}` : "Not started"}</StatusBadge>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <AddServiceForm clientId={clientId} today={today} />
    </GlassPanel>
  );
}
