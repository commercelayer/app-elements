import cn from "classnames"
import type React from "react"
import { createContext, useContext, useEffect, useId } from "react"
import { createPortal } from "react-dom"
import { Icon } from "#ui/atoms/Icon"

// Create a context for modal functions
const ModalContext = createContext<{
  onClose: () => void
  modalId: string
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
  /** Called when user clicks backdrop or the close button */
  onClose: () => void
  /** Modal content */
  children: React.ReactNode
  /** Max width preset */
  size?: "large" | "small"
}

export const Modal: React.FC<
  ModalProps & { ref?: React.RefObject<HTMLDivElement | null> }
> & {
  Header: React.FC<React.PropsWithChildren>
  Body: React.FC<React.PropsWithChildren>
  Footer: React.FC<React.PropsWithChildren>
} = ({ ref, show = false, children, onClose, size = "small" }) => {
  const modalId = useId()

  useEffect(
    function preventBodyScrollbar() {
      if (show) {
        document.body.classList.add("overflow-hidden")
      }

      return () => {
        document.body.classList.remove("overflow-hidden")
      }
    },
    [show],
  )

  const content = (
    <ModalContext.Provider value={{ onClose, modalId }}>
      <div
        className={cn(
          "bg-white rounded shadow-xl",
          "max-h-[90vh] flex flex-col",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${modalId}-title`}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onKeyDown={(e) => {
          // stop closing when pressing keys inside the dialog
          if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
            e.stopPropagation()
          }
        }}
      >
        {children}
      </div>
    </ModalContext.Provider>
  )

  return createPortal(
    <div ref={ref}>
      {show && (
        <>
          <button
            disabled={true}
            type="button"
            aria-label="Close modal"
            className="fixed inset-0 z-60 bg-gray-900/90 animate-backdrop-fade-in cursor-default"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                onClose()
              }
            }}
          />
          <div
            className={cn(
              "fixed z-70 w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              size === "large" && "max-w-155 md:w-155",
              size === "small" && "max-w-105 md:w-105",
            )}
            data-testid="modal"
          >
            {content}
          </div>
        </>
      )}
    </div>,
    document.body,
  )
}

Modal.Header = ({ children }) => {
  const { onClose, modalId } = useModalContext()

  return (
    <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div id={`${modalId}-title`} className="font-bold leading-tight">
        {children}
      </div>
      <button
        type="button"
        aria-label="Close"
        className="p-2 -m-2"
        onClick={onClose}
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  )
}

Modal.Body = ({ children }) => {
  return (
    <div className="px-6 py-4 overflow-y-auto flex-1 min-h-0">{children}</div>
  )
}

Modal.Footer = ({ children }) => {
  return (
    <div className="flex-none px-6 py-4" data-testid="modal-footer">
      {children}
    </div>
  )
}

Modal.displayName = "Modal"
