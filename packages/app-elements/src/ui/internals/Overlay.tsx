import { Container } from '#ui/atoms/Container'
import { Spacer } from '#ui/atoms/Spacer'
import cn from 'classnames'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export interface OverlayProps {
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

export const Overlay: React.FC<OverlayProps> = ({
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
