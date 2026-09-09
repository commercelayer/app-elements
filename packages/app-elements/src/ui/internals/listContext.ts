import { createContext, useContext } from "react"

/**
 * Its own module, as `overlayContext` is, so that `ListItem` does not have to
 * import the list that renders it.
 */
export const ListContext = createContext<{
  boxed: boolean
  /**
   * `true` for the row that closes the list. Only the list knows this — its rows
   * are a consumer's `ItemTemplate` — and a row cannot read it off the DOM: its
   * separator is always its own last child, and the list's own last child may be
   * a footer rather than a row.
   */
  isLastRow: boolean
}>({
  boxed: false,
  isLastRow: false,
})

/**
 * `true` when the calling row sits in a boxed list — a list nested in a parent
 * resource's page rather than being the page itself.
 *
 * Rows read it instead of taking a prop, because the list cannot reach them: they
 * come from a consumer-supplied `ItemTemplate`, so every app would otherwise have
 * to forward a flag and a forgotten one would render the wrong separators with no
 * error to show for it.
 */
export function useIsInBoxedList(): boolean {
  return useContext(ListContext).boxed
}

/** `true` when the calling row is the last one of a boxed list. */
export function useIsLastRowInBoxedList(): boolean {
  const { boxed, isLastRow } = useContext(ListContext)
  return boxed && isLastRow
}
