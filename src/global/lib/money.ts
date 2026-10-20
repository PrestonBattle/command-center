/*
 * Money helpers. The database stores integer cents; people see and type
 * dollars. Every conversion and every currency string goes through here so
 * rounding and formatting never drift between screens.
 */

const CENTS_PER_DOLLAR = 100;

/**
 * Dollars → integer cents. Rounds instead of truncating, because
 * `19.99 * 100` is `1998.9999999999998` in floating point.
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * CENTS_PER_DOLLAR);
}

/** Integer cents → dollars, for prefilling inputs that take dollars. */
export function centsToDollars(cents: number): number {
  return cents / CENTS_PER_DOLLAR;
}

type FormatOptions = {
  /** Show cents (`$1,250.50`). Off by default: whole dollars read faster. */
  showCents?: boolean;
};

/** A dollar amount as a currency string: `$1,250`. */
export function formatDollars(dollars: number, { showCents = false }: FormatOptions = {}): string {
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
}

/** A cents amount from the database as a currency string: `125050` → `$1,251`. */
export function formatCents(cents: number, options?: FormatOptions): string {
  return formatDollars(centsToDollars(cents), options);
}
