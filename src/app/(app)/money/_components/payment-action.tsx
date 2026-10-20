"use client";

import { Button } from "@mantine/core";
import { useActionButton } from "@/global/hooks/use-action-button";
import type { ScheduledPayment } from "@/global/lib/billing";
import { markPaid, undoPayment } from "../actions";

/** "Mark paid" for an expected payment, or "Undo" for a paid one. */
export function PaymentAction({ row }: { row: ScheduledPayment }) {
  const pay = useActionButton(markPaid);
  const undo = useActionButton(undoPayment);
  const label = `${row.clientName}, ${row.serviceName}`;

  return (
    <div className="flex flex-col items-end gap-1">
      {row.paymentId ? (
        <Button variant="subtle" color="dark" size="compact-sm" loading={undo.pending} onClick={() => undo.run(row.paymentId)} aria-label={`Undo payment for ${label}`}>
          Undo
        </Button>
      ) : (
        <Button variant="light" size="compact-sm" loading={pay.pending} onClick={() => pay.run({ serviceId: row.serviceId, dueOn: row.dueOn })} aria-label={`Mark ${label} paid`}>
          Mark paid
        </Button>
      )}
      {(pay.error || undo.error) && <p role="alert" className="text-xs font-semibold text-[var(--bad)]">{pay.error ?? undo.error}</p>}
    </div>
  );
}
