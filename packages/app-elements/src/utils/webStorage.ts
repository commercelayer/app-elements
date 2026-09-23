export type WebStorageArea = "localStorage" | "sessionStorage"

/**
 * Read and parse a JSON entry from web storage.
 *
 * Returns `undefined` when there is nothing to read: no `window` (SSR), no entry,
 * storage that throws on access (blocked cookies, some private modes), or a value
 * that does not parse. What we keep there is always a convenience — a cursor
 * trail, a table preference — so a lost entry must degrade to the default, never
 * break the page. The value is `unknown` on purpose: it was written by another
 * version of the code, or by hand, and the caller has to validate it.
 */
export function readWebStorage(area: WebStorageArea, key: string): unknown {
  if (typeof window === "undefined") {
    return undefined
  }

  try {
    const raw = window[area].getItem(key)
    return raw == null ? undefined : (JSON.parse(raw) as unknown)
  } catch {
    return undefined
  }
}

/**
 * Serialize a value to JSON and write it to web storage.
 *
 * Failures are swallowed: storage can be full or unavailable, and losing an
 * entry only costs the user a default.
 */
export function writeWebStorage(
  area: WebStorageArea,
  key: string,
  value: unknown,
): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    window[area].setItem(key, JSON.stringify(value))
  } catch {
    // see above: storage is best effort
  }
}
