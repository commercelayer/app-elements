import cn from "classnames"
import type React from "react"
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react"
import { createPortal } from "react-dom"
import { Icon } from "#ui/atoms/Icon"

// Create a context for modal functions
const ModalContext = createContext<{
  onClose: () => void
  modalId: string
  dismissible: boolean
} | null>(null)

// Hook to use modal context
const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("Modal components must be used within a Modal")
  }
  return context
}

export type ModalProps = {
  /** Whether the modal is open */
  show?: boolean
  /** Accessible name fallback used when Modal.Header is not rendered. */
  ariaLabel?: string
  /** Called when the modal requests to close (e.g. header close button, and backdrop/Escape when `dismissible` is true). */
  onClose: () => void
  /** Modal content */
  children: React.ReactNode
  /** Max width preset */
  size?: "large" | "small" | "x-small"
  /**
   * Enables modal dismissal via backdrop click and Escape key.
   *
   * - true: backdrop + Escape can trigger onClose.
   * - false: backdrop + Escape are ignored; closing is allowed only via mouse click on the header close button.
   *
   * Note: when false, keyboard activation (Enter/Space) on the close button is intentionally blocked.
   */
  dismissible?: boolean
}

type ModalComponent = React.ForwardRefExoticComponent<
  ModalProps & React.RefAttributes<HTMLDivElement>
> & {
  Header: React.FC<React.PropsWithChildren>
  Body: React.FC<React.PropsWithChildren>
  Footer: React.FC<React.PropsWithChildren>
}

const ModalRoot = (
  {
    show = false,
    ariaLabel,
    children,
    onClose,
    size = "small",
    dismissible = false,
  }: ModalProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const modalId = useId()
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(
    function syncDialogVisibility() {
      const dialog = dialogRef.current
      if (!dialog) return

      if (show && !dialog.open) {
        if (typeof dialog.showModal === "function") {
          dialog.showModal()
        } else {
          dialog.open = true
        }
        return
      }

      if (!show && dialog.open) {
        if (typeof dialog.close === "function") {
          dialog.close()
        } else {
          dialog.open = false
        }
      }
    },
    [show],
  )

  const content = (
    <ModalContext.Provider value={{ onClose, modalId, dismissible }}>
      <div
        className={cn(
          "bg-white rounded-md shadow-xl",
          "max-h-[90vh] flex flex-col",
        )}
      >
        {children}
      </div>
    </ModalContext.Provider>
  )

  /**
   * The modal is rendered in a portal and uses the native dialog element for
   * keyboard and focus behavior. Backdrop click/Escape can request close unless
   * `dismissible` is false.
   */
  return createPortal(
    <div ref={ref}>
      <dialog
        ref={dialogRef}
        aria-labelledby={ariaLabel != null ? undefined : `${modalId}-title`}
        aria-label={ariaLabel}
        className={cn(
          "fixed inset-0 m-0 p-4 border-none bg-transparent w-screen h-screen max-w-none max-h-none overflow-visible place-items-center backdrop:bg-transparent",
          show ? "grid" : "hidden",
        )}
        onCancel={(event) => {
          event.preventDefault()
          if (dismissible) {
            onClose()
          }
        }}
      >
        <button
          type="button"
          tabIndex={-1}
          disabled={!dismissible}
          aria-hidden={!dismissible}
          aria-label="Dismiss modal backdrop"
          data-testid="modal-backdrop"
          className="fixed inset-0 z-60 bg-gray-900/90 animate-backdrop-fade-in"
          onClick={onClose}
        />
        <div
          className={cn(
            "relative z-70 w-full",
            size === "large" && "max-w-155 md:w-155",
            size === "small" && "max-w-105 md:w-105",
            size === "x-small" && "max-w-80 md:w-80",
          )}
          data-testid="modal"
        >
          {content}
        </div>
      </dialog>
    </div>,
    document.body,
  )
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ModalRoot,
) as ModalComponent

Modal.Header = ({ children }) => {
  const { onClose, modalId, dismissible } = useModalContext()

  return (
    <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div
        id={`${modalId}-title`}
        className="font-semibold text-sm leading-tight"
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Close"
        className="p-2 -m-2"
        onClick={onClose}
        onKeyDown={(event) => {
          // Product requirement: when dismissible=false, modal must close only on mouse click.
          // Block keyboard activation on the close button (Enter/Space).
          if (!dismissible && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault()
          }
        }}
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  )
}

Modal.Body = ({ children }) => {
  return <div className="p-6 overflow-y-auto flex-1 min-h-0">{children}</div>
}

Modal.Footer = ({ children }) => {
  return (
    <div className="flex-none p-6 space-y-2" data-testid="modal-footer">
      {children}
    </div>
  )
}

Modal.displayName = "Modal"
