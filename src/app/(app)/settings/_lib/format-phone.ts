/**
 * "9045550100" → "(904) 555-0100" for the profile form. Phones are stored as
 * digits; anything that isn't a plain 10-digit US number is shown as stored.
 * Saving strips the formatting again, so the round trip is lossless.
 */
export function formatPhone(digits: string): string {
  const m = digits.match(/^(?:\+?1)?(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digits;
}
