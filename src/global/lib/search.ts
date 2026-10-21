/**
 * Does a search box's text match any of these fields? Case-insensitive,
 * ignores surrounding spaces, and an empty query matches everything.
 *
 * Phone numbers are typed every which way ("904-555-0199", "(904) 555 0199"),
 * so when the query has 3+ digits it also matches on digits alone: typing
 * "5550199" finds "(904) 555-0199".
 */
export function matchesQuery(query: string, fields: (string | null | undefined)[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const qDigits = digitsOnly(q);
  return fields.some((field) => {
    if (!field) return false;
    if (field.toLowerCase().includes(q)) return true;
    return qDigits.length >= 3 && digitsOnly(field).includes(qDigits);
  });
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}
