import { useCallback, useEffect, useState } from "react"
import { useSearch } from "wouter/use-browser-location"
import { Overlay, type OverlayProps } from "#ui/internals/Overlay"

interface OverlayOptions {
  /**
   * Optional query param to be used to control the overlay visibility.
   * When set, the overlay will be opened when the query param is set to `true` (e.g. `?myOverlay=true`)
   * and the `open` method will perform an history.push to add the query param as navigating to a new page.
   * Otherwise, the overlay will be opened as a classic in-page modal.
   **/
  queryParam?: string
  /**
   * Render the overlay already open, on its very first paint.
   * Use it when the route itself means "open", as for a details drawer: opening it
   * from an effect instead lets the page behind it paint once without the overlay,
   * which shows up as a flicker when landing on the url or reloading the page.
   * @default false
   **/
  initialOpen?: boolean
}

interface OverlayHook {
  /**
   * The overlay component.
   **/
  Overlay: React.FC<OverlayProps>
  /**
   * Function to be used to open the overlay.
   **/
  open: () => void
  /**
   * Function to be used to close the overlay.
   **/
  close: () => void
}

export function useOverlay(options?: OverlayOptions): OverlayHook {
  // `queryParam` is optional, so it is read once here: narrowing it through
  // `isInQueryParamMode` no longer reaches the callbacks below
  const queryParam = options?.queryParam
  // an overlay that is already open on page load is part of the first paint,
  // instead of appearing right after it
  const [show, setShow] = useState(options?.initialOpen === true)
  const search = useSearch()
  const isInQueryParamMode = window != null && queryParam != null

  // close the overlay by going back in history when it's configured to work with `queryParam`
  // otherwise, just update internal visibility state
  const close = useCallback((): void => {
    if (isInQueryParamMode) {
      window.history.back()
    } else {
      setShow(false)
    }
  }, [isInQueryParamMode])

  // open the overlay by pushing a new history state when it's configured to work with `queryParam`
  // otherwise, just update internal visibility state
  const open = useCallback((): void => {
    if (isInQueryParamMode) {
      const url = new URL(window.location.href)
      url.searchParams.append(queryParam, "true")
      window.history.pushState({}, "", url.toString())
    } else {
      setShow(true)
    }
  }, [isInQueryParamMode, queryParam])

  // when component is mounted and `queryParam` exists in current url, overlay will automatically opened
  useEffect(
    function restoreVisibilityOnPageLoad() {
      if (queryParam != null) {
        const params = new URLSearchParams(search)
        setShow(params.get(queryParam) === "true")
      }
    },
    [search, queryParam],
  )

  const Empty = useCallback(() => null, [])

  return {
    Overlay: show ? Overlay : Empty,
    close,
    open,
  }
}
