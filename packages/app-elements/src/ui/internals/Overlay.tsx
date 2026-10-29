import cn from "classnames"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Container } from "#ui/atoms/Container"
import { Spacer } from "#ui/atoms/Spacer"
import { lockBodyScroll, unlockBodyScroll } from "./bodyScrollLock"
import { DialogPortalContext } from "./dialogPortal"
import { OverlayContext } from "./overlayContext"
import { enterTopLayer, leaveTopLayer } from "./topLayerHost"

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
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  // also kept in state, to hand it down to what is portalled into it
  const [dialogElement, setDialogElement] = useState<HTMLDialogElement | null>(
    null,
  )
  const setDialogRef = useCallback((node: HTMLDialogElement | null) => {
    dialogRef.current = node
    setDialogElement(node)
  }, [])
  const titleId = useId()

  useEffect(
    function openAsModalDialog() {
      // A modal `<dialog>`, as `Modal` already is: the browser keeps Tab inside
      // it, makes the page behind inert and turns Escape into a `cancel` event.
      const dialog = dialogRef.current
      if (dialog == null) return
      const opener = document.activeElement
      if (typeof dialog.showModal === "function" && !dialog.open) {
        dialog.showModal()
      } else {
        dialog.open = true
      }
      // Named after the page heading it renders (`PageHeading` draws an `h1`,
      // also while loading), so no app has to pass a label of its own.
      const heading = element.current?.querySelector("h1")
      if (heading != null) {
        heading.id = heading.id || titleId
        dialog.setAttribute("aria-labelledby", heading.id)
      }
      // `showModal()` focuses the first control, which in a drawer is the
      // heading's close button: a second Enter would close the drawer it just
      // opened. Focus the panel instead; an edit overlay then moves it on to its
      // first field, below.
      element.current?.focus()
      // toasts raised from inside have to render inside, see `topLayerHost`
      enterTopLayer(dialog)
      return () => {
        leaveTopLayer(dialog)
        // Cleanup runs while the dialog is still in the DOM and modal, so the
        // page behind is inert and cannot take focus yet: close it first. The
        // explicit focus covers the dialog having been reopened in between.
        if (dialog.open) {
          if (typeof dialog.close === "function") {
            dialog.close()
          } else {
            dialog.open = false
          }
        }
        if (opener instanceof HTMLElement && opener.isConnected) {
          opener.focus()
        }
      }
    },
    [titleId],
  )

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
      // Only an editing overlay: there the first input is the first form field, so
      // focusing it saves a click. A `drawer` is a details panel, whose only input
      // tends to be the timeline's note field at the very bottom — focusing that
      // scrolled the panel down to it on open, and only sometimes, since the effect
      // catches whatever has rendered by then (a cached resource paints its timeline
      // straight away, a cold one does not).
      if (drawer === true) {
        return
      }
      if (element.current != null) {
        const firstInputElement =
          element.current.getElementsByTagName("input")[0]
        firstInputElement?.focus()
      }
    },
    [element, drawer],
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
    <OverlayContext.Provider
      value={{ surface: drawer === true ? "drawer" : "page" }}
    >
      <DialogPortalContext.Provider value={dialogElement}>
        <dialog
          ref={setDialogRef}
          className="fixed inset-0 m-0 p-0 border-none bg-transparent w-screen h-screen max-w-none max-h-none overflow-visible backdrop:bg-transparent"
          onCancel={(event) => {
            // React hands `cancel` up the component tree, not the DOM one: a
            // `Modal` rendered inside the overlay would close it along with itself
            if (event.target !== event.currentTarget) return
            event.preventDefault()
            if (drawer) {
              onBackdropClick?.()
            }
          }}
        >
          {drawer && (
            <div
              aria-hidden
              className="fixed inset-0 z-50 bg-gray-900 animate-backdrop-fade-in"
              onClick={onBackdropClick}
            />
          )}
          <div
            ref={element}
            tabIndex={-1}
            className={cn(
              "overlay-container",
              "fixed z-50 h-full overflow-y-auto outline-hidden",
              {
                // the class is what a block sitting on this surface reads to pick its
                // own shade: `bg-gray-50` alone is invisible on a gray-50 overlay
                "bg-gray-50 overlay-container-light":
                  backgroundColor === "light",
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
        </dialog>
      </DialogPortalContext.Provider>
    </OverlayContext.Provider>,
    document.body,
  )
}

Overlay.displayName = "Overlay"
