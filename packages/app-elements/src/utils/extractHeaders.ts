import type { JsonObject } from 'type-fest'

/**
 * Extract all keys from an array of objects of different shapes,
 * @param data - array of objects of different shapes
 * @returns an array of string values
 */
export function extractHeaders(data: JsonObject[]): string[] {
  const allHeaders = new Set<string>()
  data.forEach((row) => {
    Object.keys(row).forEach((h) => allHeaders.add(h))
  })

  return Array.from(allHeaders)
}
