import cn from "classnames"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Container } from "#ui/atoms/Container"
import { Spacer } from "#ui/atoms/Spacer"

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
  backgroundColor?: "light"

  /**
   * Set the overlay to full width
   * @default false
   */
  fullWidth?: boolean

  /**
   * Class name for the overlay container
   */
  contentClassName?: string

  /**
   * Style object for the overlay container
   */
  contentStyle?: React.CSSProperties
}

export const Overlay: React.FC<OverlayProps> = ({
  footer,
  children,
  backgroundColor,
  contentClassName,
  contentStyle,
  fullWidth = false,
  ...rest
}) => {
  const element = useRef<HTMLDivElement | null>(null)

  useEffect(function preventBodyScrollbar() {
    document.body.classList.add("overflow-hidden")
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [])

  useEffect(
    function focusFirstInput() {
      if (element.current != null) {
        const firstInputElement =
          element.current.getElementsByTagName("input")[0]
        firstInputElement?.focus()
      }
    },
    [element],
  )

  const content = (
    <div className={contentClassName} style={contentStyle}>
      <Spacer bottom={fullWidth ? undefined : "14"}>{children}</Spacer>
      {footer != null && (
        <div
          className={cn("w-full sticky bottom-0 pb-8", {
            "bg-gray-50": backgroundColor === "light",
            "bg-white": backgroundColor == null,
          })}
          data-testid="overlay-buttonContainer"
        >
          {footer}
        </div>
      )}
    </div>
  )

  return createPortal(
    <div
      ref={element}
      role="dialog"
      className={cn(
        "overlay-container",
        "fixed inset-0 z-50 w-full h-full  overflow-y-auto outline-hidden",
        {
          "bg-gray-50": backgroundColor === "light",
          "bg-white": backgroundColor == null,
        },
      )}
      data-testid="overlay"
      {...rest}
    >
      {fullWidth ? content : <Container minHeight={false}>{content}</Container>}
    </div>,
    document.body,
  )
}

Overlay.displayName = "Overlay"
