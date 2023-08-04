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
  const [stickyButton, setStickyButton] = useState(false)
  const element = useRef<HTMLDivElement | null>(null)
  const overlayContent = useRef<HTMLDivElement | null>(null)
  const overlayButton = useRef<HTMLDivElement | null>(null)

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

  const updateButtonPosition = useCallback(() => {
    if (hasButton) {
      const content = overlayContent?.current
      const button = overlayButton?.current
      if (content != null && button != null && window.visualViewport != null) {
        if (
          Number(content.clientHeight) + Number(button.clientHeight) >
          Number(window.visualViewport.height)
        ) {
          setStickyButton(true)
        }
      }
    }
  }, [hasButton, overlayContent, overlayButton])

  return createPortal(
    <div
      ref={element}
      role='dialog'
      tabIndex={0}
      className='fixed inset-0 z-50 w-full h-full bg-white overflow-y-auto outline-none'
      data-test-id='overlay'
      {...rest}
    >
      <Container className={cn('pt-5')} minHeight={false}>
        <div ref={overlayContent}>{children}</div>

        {hasButton && (
          <>
            <div
              ref={overlayButton}
              className={cn([
                'w-full pt-14',
                { 'sticky bottom-0': stickyButton }
              ])}
            >
              <Container
                minHeight={false}
                className='bg-white pb-4'
                data-test-id='overlay-buttonContainer'
              >
                {/* eslint-disable react/jsx-handler-names */}
                <Button
                  type='button'
                  onClick={button.onClick}
                  className='w-full'
                >
                  {button.label}
                </Button>
              </Container>
            </div>
            <VisibilityTrigger
              enabled
              callback={() => {
                updateButtonPosition()
              }}
            />
          </>
        )}
      </Container>
    </div>,
    document.body
  )
}

Overlay.displayName = 'Overlay'
export { Overlay }
