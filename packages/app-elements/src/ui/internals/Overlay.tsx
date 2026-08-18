import cn from "classnames"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Container } from "#ui/atoms/Container"
import { Spacer } from "#ui/atoms/Spacer"
import { lockBodyScroll, unlockBodyScroll } from "./bodyScrollLock"
import { OverlayContext } from "./overlayContext"

export type OverlayProps = {
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
   * Class name for the overlay container
   */
  contentClassName?: string

  /**
   * Style object for the overlay container
   */
  contentStyle?: React.CSSProperties
} & (
  | {
      /**
       * Set the overlay to full width
       * @default false
       */
      fullWidth?: boolean
      drawer?: never
      onBackdropClick?: never
    }
  | {
      /**
       * Set the overlay to be displayed as a drawer on the right side of the screen.
       * @default false
       */
      drawer: true
      /**
       * Callback function to be called when the backdrop is clicked.
       * This is useful for closing the overlay when clicking outside of it.
       */
      onBackdropClick: () => void
      fullWidth?: never
    }
)

export const Overlay: React.FC<OverlayProps> = ({
  footer,
  children,
  backgroundColor,
  contentClassName,
  contentStyle,
  fullWidth = false,
  drawer = false,
  onBackdropClick,
  ...rest
}) => {
  const element = useRef<HTMLDivElement | null>(null)

  useEffect(function preventBodyScrollbar() {
    // shared with `Modal` and with any other overlay open at the same time: an
    // edit overlay closing inside a details drawer must leave the drawer's lock
    // in place, and a plain `classList.remove` here would not
    lockBodyScroll()
    return () => {
      unlockBodyScroll()
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
    <div
      className={cn(contentClassName, {
        "h-full": drawer,
        "pb-12": !drawer && footer == null,
      })}
      style={contentStyle}
    >
      <Spacer
        bottom={fullWidth || drawer ? undefined : "14"}
        className={cn({
          "h-full": drawer,
        })}
      >
        {children}
      </Spacer>
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
    <OverlayContext.Provider value={{ isDrawer: drawer === true }}>
      {drawer && (
        <div
          aria-hidden
          className="fixed inset-0 z-50 bg-gray-900 animate-backdrop-fade-in"
          onClick={onBackdropClick}
        />
      )}
      <div
        ref={element}
        role="dialog"
        className={cn(
          "overlay-container",
          "fixed z-50 h-full overflow-y-auto outline-hidden",
          {
            "bg-gray-50": backgroundColor === "light",
            "bg-white": backgroundColor == null,
            "inset-0 w-full": !drawer,
            // Full width on mobile. There used to be a 95vw max-width here, but it
            // could only ever bind below `md`: the `md` width is a fixed 680px and
            // 95vw is already wider than that at the breakpoint itself.
            //
            // (Written out rather than as a class name on purpose — Tailwind scans
            // comments too, and would keep emitting the rule we just dropped.)
            "top-0 right-0 bottom-0 w-full md:w-170 animate-slide-in-right":
              drawer,
          },
        )}
        data-testid="overlay"
        // lets descendants adapt to the narrower surface without every app
        // passing a prop down — `PageHeading` uses it to shrink its title
        data-drawer={drawer ? "" : undefined}
        {...rest}
      >
        {fullWidth || drawer ? (
          content
        ) : (
          <Container minHeight={false}>{content}</Container>
        )}
      </div>
    </OverlayContext.Provider>,
    document.body,
  )
}

Overlay.displayName = "Overlay"
