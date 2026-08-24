import { useCallback, useRef } from "react"
import { useTokenProvider } from "#providers/TokenProvider"

const storageVersion = 1

interface StoredTrail {
  version: number
  fingerprint: string
  cursors: Array<string | null>
}

export interface MetricsCursorTrail {
  /**
   * The cursor that opens `page`, or `undefined` when the trail does not hold
   * it — in which case that page cannot be opened at all.
   */
  cursorFor: (page: number) => string | null | undefined
  /**
   * Record, after loading `page`, the cursor that opens the page after it.
   */
  record: (page: number, cursor: string | null) => void
  /** Forget every cursor but page 1's, which is always "no cursor". */
  reset: () => void
}

/**
 * The cursor trail of a metrics-backed list, kept in `sessionStorage`.
 *
 * The metrics api only moves forward: the cursor that opens page N is handed
 * back when page N-1 is fetched. Holding those cursors is what lets the pager
 * step backwards, and persisting them is what lets a list reopen on the page it
 * was left on, since going to a details page unmounts the list and would
 * otherwise take the trail with it.
 *
 * `sessionStorage` is the right shelf for it: it is per tab, it survives a
 * reload, and it is gone when the tab is. A trail is private to the session
 * that walked it, and a link someone shares carries no cursor.
 *
 * One entry per list, so nothing accumulates. The entry records the query it
 * was walked against, and a trail measured against a different one is dropped
 * rather than trusted: a cursor is only meaningful for the exact filters and
 * sort that produced it.
 */
export function useMetricsCursorTrail({
  enabled,
  type,
  metricsQuery,
}: {
  /** Only metrics-backed lists in `pagination` mode keep a trail. */
  enabled: boolean
  type: string
  metricsQuery: unknown
}): MetricsCursorTrail {
  const {
    settings: { mode, organizationSlug, appSlug, domain },
  } = useTokenProvider()

  // Scope in clear so entries stay readable in devtools and can be evicted by
  // prefix; without it, switching organization or moving from test to live
  // would resume paging against another scope's trail.
  const storageKey = `cl.metrics.trail.${mode}.${organizationSlug}.${appSlug}.${type}`

  const fingerprint = fingerprintOf(`${domain}|${queryIdentity(metricsQuery)}`)

  const trailRef = useRef<{
    fingerprint: string
    cursors: Array<string | null>
  } | null>(null)

  const cursors = useCallback((): Array<string | null> => {
    if (trailRef.current?.fingerprint === fingerprint) {
      return trailRef.current.cursors
    }
    // first use, or the query changed under us: whatever was remembered was
    // measured against a different list
    const loaded = enabled ? readTrail(storageKey, fingerprint) : [null]
    trailRef.current = { fingerprint, cursors: loaded }
    return loaded
  }, [enabled, storageKey, fingerprint])

  const persist = useCallback(() => {
    if (!enabled || trailRef.current == null) {
      return
    }
    writeTrail(storageKey, {
      version: storageVersion,
      fingerprint,
      cursors: trailRef.current.cursors,
    })
  }, [enabled, storageKey, fingerprint])

  const cursorFor = useCallback(
    (page: number) => cursors()[page - 1],
    [cursors],
  )

  const record = useCallback(
    (page: number, cursor: string | null) => {
      cursors()[page] = cursor
      persist()
    },
    [cursors, persist],
  )

  const reset = useCallback(() => {
    trailRef.current = { fingerprint, cursors: [null] }
    persist()
  }, [fingerprint, persist])

  return { cursorFor, record, reset }
}

function readTrail(key: string, fingerprint: string): Array<string | null> {
  if (typeof window === "undefined") {
    return [null]
  }

  try {
    const raw = window.sessionStorage.getItem(key)
    if (raw == null) {
      return [null]
    }

    const stored = JSON.parse(raw) as StoredTrail
    if (
      stored.version !== storageVersion ||
      stored.fingerprint !== fingerprint ||
      !Array.isArray(stored.cursors) ||
      stored.cursors[0] !== null
    ) {
      return [null]
    }

    return stored.cursors
  } catch {
    // unreadable or unparseable: a lost trail only costs a walk from page 1
    return [null]
  }
}

function writeTrail(key: string, trail: StoredTrail): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.sessionStorage.setItem(key, JSON.stringify(trail))
  } catch {
    // storage can be full or unavailable (private browsing); the trail is a
    // convenience, so losing it must never break paging
  }
}

/**
 * What makes two metrics queries "the same list" for the purpose of reusing a
 * cursor trail.
 *
 * The query is hashed rather than stored: filter values reach the metrics api
 * as `aggregated_details`, which is where a text search puts customer names and
 * emails, and those have no business sitting in web storage.
 *
 * Timestamps are compared by day rather than verbatim. With no date filter set,
 * the metrics filter defaults to "the last year, ending now", recomputed on
 * every mount down to the second — hashing that as-is gives every mount its own
 * fingerprint and the trail never survives the trip to a details page, which is
 * the one thing it exists for. An end that moved by seconds does not
 * meaningfully change which records are in the set, and the boundary drift that
 * comes with it is the same one cursor pagination has anyway. A range the user
 * actually changed resets the trail through `isQueryChanged`, well before this
 * fingerprint is consulted.
 *
 * Key order out of `JSON.stringify` is insertion order, stable here because the
 * same code builds the query every time. Were it ever to vary, the fingerprint
 * would stop matching and the trail would be dropped — the safe way to fail.
 */
function queryIdentity(metricsQuery: unknown): string {
  return JSON.stringify(metricsQuery ?? null).replace(
    /\d{4}-\d{2}-\d{2}T[\d:.]+Z?/g,
    (timestamp) => timestamp.slice(0, 10),
  )
}

/**
 * 64 bits of FNV-1a-style hashing, as two 32-bit halves in base 36.
 *
 * Not a cryptographic hash and not meant to be: it only has to make an
 * accidental match between two different queries implausible, and it exists so
 * that the query itself never has to be written down.
 */
function fingerprintOf(value: string): string {
  let hashA = 0x811c9dc5
  let hashB = 0x01000193

  for (let index = 0; index < value.length; index++) {
    const charCode = value.charCodeAt(index)
    hashA = Math.imul(hashA ^ charCode, 0x01000193)
    hashB = Math.imul(hashB ^ charCode, 0x85ebca6b)
  }

  return `${(hashA >>> 0).toString(36)}${(hashB >>> 0).toString(36)}`
}
