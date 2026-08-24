import { useCallback } from "react"
import { useSearch } from "wouter/use-browser-location"

const pageParam = "page"

export interface UsePageInUrlReturn {
  /**
   * The page the url is asking for. `1` when the parameter is absent, or when
   * its value is not a positive integer.
   */
  requestedPage: number
  /**
   * Write `page` to the url as a new history entry, so the browser's back
   * button walks back through the pages the user visited.
   */
  pushPage: (page: number) => void
  /**
   * Write `page` to the url in place, without a history entry. Use it to
   * correct a page the list could not open: pushing would leave the unservable
   * page in history, so going back would return to it and correct it again,
   * trapping the user on the pager.
   */
  replacePage: (page: number) => void
}

/**
 * Keeps the current page of a paginated list in the query string.
 *
 * This is what makes the page survive leaving the list and coming back, either
 * with the browser's back button or with `goBack` from `useAppLinking`, which
 * restores the whole url including its query string.
 *
 * Page 1 carries no parameter: it is the default, and a bare url is the one
 * worth sharing.
 *
 * The parameter is not namespaced, so two paginated lists rendered on the same
 * route would share it. No page does that today.
 */
export function usePageInUrl(): UsePageInUrlReturn {
  const search = useSearch()
  const requestedPage = parsePage(search)

  // Neither setter closes over `search`: they read the live url when called, so
  // their identity stays stable across navigations and effects depending on
  // them do not re-run on every url change.
  const writePage = useCallback((page: number, mode: "push" | "replace") => {
    const url = new URL(window.location.href)

    if (page <= 1) {
      url.searchParams.delete(pageParam)
    } else {
      url.searchParams.set(pageParam, String(page))
    }

    // writing the url it already has would add a history entry for nothing, and
    // wake up every wouter subscriber to announce that nothing changed
    if (url.href === window.location.href) {
      return
    }

    window.history[mode === "push" ? "pushState" : "replaceState"](
      {},
      "",
      url.href,
    )
  }, [])

  const pushPage = useCallback(
    (page: number) => {
      writePage(page, "push")
    },
    [writePage],
  )

  const replacePage = useCallback(
    (page: number) => {
      writePage(page, "replace")
    },
    [writePage],
  )

  return { requestedPage, pushPage, replacePage }
}

function parsePage(search: string): number {
  const raw = new URLSearchParams(search).get(pageParam)

  if (raw == null) {
    return 1
  }

  const parsed = Number(raw)
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1
}
