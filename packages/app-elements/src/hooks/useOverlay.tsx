import { Overlay, type OverlayProps } from '#ui/internals/Overlay'
import { useCallback, useEffect, useState } from 'react'
import { useSearch } from 'wouter/use-browser-location'

interface OverlayOptions {
  /**
   * Optional query param to be used to control the overlay visibility.
   * When set, the overlay will be opened when the query param is set to `true` (e.g. `?myOverlay=true`)
   * and the `open` method will perform an history.push to add the query param as navigating to a new page.
   * Otherwise, the overlay will be opened as a classic in-page modal.
   **/
  queryParam: string
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
  const [show, setShow] = useState(false)
  const search = useSearch()
  const isInQueryParamMode = window != null && options?.queryParam != null

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
      url.searchParams.append(options.queryParam, 'true')
      window.history.pushState({}, '', url.toString())
    } else {
      setShow(true)
    }
  }, [isInQueryParamMode, options?.queryParam])

  // when component is mounted and `queryParam` exists in current url, overlay will automatically opened
  useEffect(
    function restoreVisibilityOnPageLoad() {
      if (options?.queryParam != null) {
        const params = new URLSearchParams(search)
        setShow(params.get(options.queryParam) === 'true')
      }
    },
    [search, options?.queryParam]
  )

  const Empty = useCallback(() => null, [])

  return {
    Overlay: show ? Overlay : Empty,
    close,
    open
  }
}
