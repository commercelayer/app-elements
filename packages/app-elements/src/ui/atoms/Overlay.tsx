import { Container } from '#ui/atoms/Container'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'
import { Spacer } from './Spacer'

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
      className='fixed inset-0 z-50 w-full h-full bg-white overflow-y-auto outline-none'
      data-test-id='overlay'
      {...rest}
    >
      <Container minHeight={false}>
        <Spacer bottom='14'>{children}</Spacer>
        {hasButton && (
          <Container
            minHeight={false}
            className='w-full sticky bottom-0 bg-white pb-8'
            data-test-id='overlay-buttonContainer'
          >
            {/* eslint-disable react/jsx-handler-names */}
            <Button type='button' onClick={button.onClick} className='w-full'>
              {button.label}
            </Button>
          </Container>
        )}
      </Container>
    </div>,
    document.body
  )
}

Overlay.displayName = 'Overlay'
export { Overlay }
