import { Container } from '#ui/atoms/Container'
import { Spacer } from '#ui/atoms/Spacer'
import cn from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSearch } from 'wouter/use-location'

interface OverlayProps {
  /**
   * The content of the overlay.
   **/
  children: React.ReactNode
  /**
   * Footer element to be rendered at the bottom of the overlay.
   **/
  footer?: React.ReactNode
  /**
   * Set a gray background color
   */
  backgroundColor?: 'light'
}

const Overlay: React.FC<OverlayProps> = ({
  footer,
  children,
  backgroundColor,
  ...rest
}) => {
  const element = useRef<HTMLDivElement | null>(null)

  useEffect(function preventBodyScrollbar() {
    document.body.classList.add('overflow-hidden')
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  useEffect(
    function focusFirstInput() {
      if (element.current != null) {
        const firstInputElement =
          element.current.getElementsByTagName('input')[0]
        firstInputElement?.focus()
      }
    },
    [element]
  )

  return createPortal(
    <div
      ref={element}
      role='dialog'
      tabIndex={0}
      className={cn(
        'fixed inset-0 z-50 w-full h-full  overflow-y-auto outline-none',
        {
          'bg-gray-50': backgroundColor === 'light',
          'bg-white': backgroundColor == null
        }
      )}
      data-testid='overlay'
      {...rest}
    >
      <Container minHeight={false}>
        <Spacer bottom='14'>{children}</Spacer>
        {footer != null && (
          <div
            className={cn('w-full sticky bottom-0 pb-8', {
              'bg-gray-50': backgroundColor === 'light',
              'bg-white': backgroundColor == null
            })}
            data-testid='overlay-buttonContainer'
          >
            {footer}
          </div>
        )}
      </Container>
    </div>,
    document.body
  )
}
Overlay.displayName = 'Overlay'

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

  return {
    Overlay: show ? Overlay : () => null,
    close,
    open
  }
}
