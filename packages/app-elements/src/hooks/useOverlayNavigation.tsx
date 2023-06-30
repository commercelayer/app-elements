import { Overlay, type OverlayProps } from '#ui/atoms/Overlay'
import { useCallback, useEffect, useState } from 'react'
import { useSearch } from 'wouter/use-location'

interface OverlayNavigationOptions {
  /**
   * The query param to be used to control the overlay visibility.
   **/
  queryParam: string
}

interface OverlayNavigation {
  /**
   * The overlay component.
   **/
  Overlay: React.FC<OverlayProps>
  /**
   * Function to be used to open the overlay.
   * It will add the query param to the URL.
   * @param replaceHistory If true, the query param will be added without creating a new history entry.
   **/
  open: (replaceHistory?: boolean) => void
  /**
   * Function to be used to close the overlay.
   * It's a simple history.back() call.
   **/
  close: () => void
}

export function useOverlayNavigation({
  queryParam
}: OverlayNavigationOptions): OverlayNavigation {
  const [show, setShow] = useState(false)
  const search = useSearch()

  useEffect(() => {
    if (queryParam != null) {
      const params = new URLSearchParams(search)
      setShow(params.get(queryParam) === 'true')
    }
  }, [search, queryParam])

  const close = useCallback((): void => {
    if (window != null) {
      window.history.back()
    }
  }, [])

  const open = useCallback((replaceHistory?: boolean): void => {
    if (window != null) {
      const url = new URL(window.location.href)
      url.searchParams.append(queryParam, 'true')
      const action = replaceHistory === true ? 'replaceState' : 'pushState'
      window.history[action]({}, '', url.toString())
    }
  }, [])

  return {
    Overlay: show ? Overlay : () => null,
    close,
    open
  }
}
