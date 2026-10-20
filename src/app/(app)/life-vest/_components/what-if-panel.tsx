"use client";

import { Select, Slider } from "@mantine/core";
import { useState } from "react";
import { GlassPanel } from "@/global/components/glass/glass-panel";
import { Callout } from "@/global/components/layout";
import { formatCents } from "@/global/lib/money";
import { applyWhatIf, type WhatIfInputs } from "../_lib/what-if";

type Props = Omit<WhatIfInputs, "lostCents" | "gainedCents" | "personalChangeCents"> & {
  clients: { id: string; name: string; monthlyCents: number }[];
};

/**
 * Try out changes without saving anything: lose a client, land new work,
 * personal costs going up or down. The result updates as you move the
 * controls and is announced politely to screen readers.
 */
export function WhatIfPanel({ clients, ...base }: Props) {
  const [lostId, setLostId] = useState<string | null>(null);
  const [gainedDollars, setGained] = useState(0);
  const [personalDollars, setPersonal] = useState(0);

  const lost = clients.find((c) => c.id === lostId);
  const result = applyWhatIf({
    ...base,
    lostCents: lost?.monthlyCents ?? 0,
    gainedCents: gainedDollars * 100,
    personalChangeCents: personalDollars * 100,
  });

  return (
    <GlassPanel title="What if…">
      <Select
        label="I lose a client"
        placeholder="Nobody leaves"
        clearable
        data={clients.map((c) => ({ value: c.id, label: `${c.name} (${formatCents(c.monthlyCents)}/mo)` }))}
        value={lostId}
        onChange={setLostId}
      />
      <div className="flex flex-col gap-2">
        <p id="gain-label" className="flex justify-between text-sm font-semibold">
          I land new work worth <span className="tabular-nums">{formatCents(gainedDollars * 100)}/mo</span>
        </p>
        <Slider aria-labelledby="gain-label" min={0} max={5000} step={100} value={gainedDollars} onChange={setGained} label={(v) => formatCents(v * 100)} />
      </div>
      <div className="flex flex-col gap-2">
        <p id="personal-label" className="flex justify-between text-sm font-semibold">
          My personal costs change by{" "}
          <span className="tabular-nums">{personalDollars >= 0 ? "+" : "−"}{formatCents(Math.abs(personalDollars) * 100)}/mo</span>
        </p>
        <Slider aria-labelledby="personal-label" min={-1000} max={2000} step={50} value={personalDollars} onChange={setPersonal} label={(v) => formatCents(v * 100)} />
      </div>
      <div aria-live="polite">
        <Callout
          tone={result.gapCents >= 0 ? "ok" : "warn"}
          title={result.gapCents >= 0 ? `You'd still be ${formatCents(result.gapCents)} above your floor` : `You'd be ${formatCents(-result.gapCents)} short each month`}
        >
          Revenue {formatCents(result.revenueCents)} against a floor of {formatCents(result.floorCents)}.
        </Callout>
      </div>
    </GlassPanel>
  );
}
