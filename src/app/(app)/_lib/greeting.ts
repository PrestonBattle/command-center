/** "Good morning" / "Good afternoon" / "Good evening" for an hour 0–23. */
export function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** The current hour in a timezone. */
export function hourIn(timeZone: string): number {
  return Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone }).format(new Date()));
}
