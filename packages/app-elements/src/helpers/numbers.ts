export interface FormatNumberOptions {
  /** The value to format. `null`/`undefined` formats as `0`. */
  value: number | null | undefined
  /**
   * BCP 47 locale, as `user?.locale` from `useTokenProvider`.
   *
   * Omitted, the runtime's own locale is used — right for the parts of the UI with
   * no signed-in user to ask (the dashboard's subscription pages), and the same
   * source `toLocaleString()` used there before. Prefer passing the user's locale
   * wherever there is one: it is what they chose, not what their browser is set to.
   */
  locale?: string
}

/**
 * Formats a count for display: grouped in thousands, in the user's locale.
 *
 * Counts come off the API as bare integers, and a four-digit one is hard to read
 * unseparated — `12345` reads as a code rather than a quantity. Grouping is
 * locale-specific (`1,234` in en-US, `1.234` in it-IT), which is why this takes a
 * locale rather than leaving each call site to pick one.
 *
 * For money use `formatCentsToCurrency`: an amount also needs its currency's
 * subunit and symbol, which this deliberately knows nothing about.
 */
export function formatNumber({ value, locale }: FormatNumberOptions): string {
  return Intl.NumberFormat(locale, {
    // Grouping is forced rather than left to the locale's default: it-IT and es-ES
    // group only from five digits, so `1234` and `12345` in the same column would
    // render as "1234" and "12.345" — the same quantity styled two ways. Matches
    // what the promotions page already did by hand.
    useGrouping: "always",
  }).format(value ?? 0)
}
