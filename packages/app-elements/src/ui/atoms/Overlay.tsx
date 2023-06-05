import { Container } from '#ui/atoms/Container'
import { VisibilityTrigger } from '#ui/resources/ResourceList/VisibilityTrigger'
import cn from 'classnames'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

export interface OverlayProps {
  /**
   * The content of the overlay.
   **/
  children: React.ReactNode
  /**
   * The action button to be rendered at the bottom of the overlay.
   * If set to 'none', no button will be rendered.
   * If set to an object, the button will be rendered with the label and the onClick handler.
   * @default 'none'
   **/
  button?:
    | 'none'
    | {
        onClick: () => void
        label: string
      }
}

const Overlay: React.FC<OverlayProps> = ({
  button = 'none',
  children,
  ...rest
}) => {
  const hasButton = button !== 'none'
  const element = useRef<HTMLDivElement | null>(null)
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

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

  const applyInnerScrollbarDiff = useCallback(() => {
    if (hasButton) {
      const current = element?.current
      if (current != null) {
        setScrollbarWidth(window.innerWidth - current.clientWidth)
      }
    }
  }, [element])

  return createPortal(
    <div
      ref={element}
      role='dialog'
      tabIndex={0}
      className='fixed inset-0 z-50 w-full h-full bg-white overflow-y-auto outline-none'
      data-test-id='overlay'
      {...rest}
    >
      <Container
        className={cn('pt-5', {
          'pb-20': hasButton
        })}
      >
        <div>{children}</div>
      </Container>
      {hasButton && (
        <>
          <div
            className='fixed bottom-0 left-0'
            style={{
              right: scrollbarWidth
            }}
          >
            <Container
              minHeight={false}
              className='bg-white pb-4'
              data-test-id='overlay-buttonContainer'
            >
              {/* eslint-disable-next-line react/jsx-handler-names */}
              <Button onClick={button.onClick} className='w-full'>
                {button.label}
              </Button>
            </Container>
          </div>
          <VisibilityTrigger
            enabled
            callback={() => {
              applyInnerScrollbarDiff()
            }}
          />
        </>
      )}
    </div>,
    document.body
  )
}

Overlay.displayName = 'Overlay'
export { Overlay }
