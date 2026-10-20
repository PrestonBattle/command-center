"use client";

import { ConfirmButton } from "@/global/components/confirm-button";
import { endService } from "../../actions";

/** Ends a service today, after a confirm. */
export function EndServiceButton({ serviceId, clientId, serviceName }: { serviceId: string; clientId: string; serviceName: string }) {
  return (
    <ConfirmButton
      title={`End ${serviceName}?`}
      message="It stops counting toward revenue and won't show up in future months. Past payments stay."
      confirmLabel="End service"
      action={() => endService(serviceId, clientId)}
      buttonProps={{ size: "compact-sm", "aria-label": `End ${serviceName}` }}
    >
      End
    </ConfirmButton>
  );
}
