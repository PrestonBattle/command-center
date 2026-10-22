/** One timezone in a picker: "New York (GMT-4)" under "America". */
export type TimezoneOption = { value: string; label: string };
export type TimezoneGroup = { group: string; items: TimezoneOption[] };

/** "GMT-4" for a zone right now (so it follows daylight saving). */
export function utcOffsetLabel(timeZone: string, at: Date = new Date()): string {
  const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName");
  return part?.value ?? "GMT";
}

/**
 * Every IANA timezone, grouped by region for a searchable select:
 * "America/Argentina/Buenos_Aires" → "Argentina · Buenos Aires (GMT-3)" under
 * "America". Built on the server and sent as data, so the server and browser
 * never disagree about the list. `include` makes sure a saved zone appears.
 */
export function timezoneOptions(at: Date = new Date(), include?: string): TimezoneGroup[] {
  const groups = new Map<string, TimezoneOption[]>();
  // The saved zone may be an alias this runtime lists under another name
  // (browsers and Node differ); include it so the picker can show it.
  const zones = Intl.supportedValuesOf("timeZone");
  if (include && !zones.includes(include)) zones.push(include);
  for (const zone of zones) {
    const [region, ...rest] = zone.split("/");
    if (!rest.length) continue; // "UTC" and similar have no region
    const place = rest.join(" · ").replaceAll("_", " ");
    const items = groups.get(region) ?? [];
    items.push({ value: zone, label: `${place} (${utcOffsetLabel(zone, at)})` });
    groups.set(region, items);
  }
  return [...groups].map(([group, items]) => ({ group, items }));
}
