import cn from "classnames"
import type React from "react"
import { createContext, useContext, useId } from "react"
import {
  Dialog as AriaDialog,
  Modal as AriaModal,
  ModalOverlay,
} from "react-aria-components"
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
  size?: "large" | "small" | "x-small"
  /** Whether to close the modal when the user interacts outside it */
  isDismissable?: boolean
  /** Whether pressing the escape key to close the modal should be disabled */
  isKeyboardDismissDisabled?: boolean
  /** Ref to the modal container element for portaling dropdown menus */
  ref?: React.RefObject<HTMLDivElement | null>
}

export const Modal: React.FC<ModalProps> & {
  Header: React.FC<React.PropsWithChildren>
  Body: React.FC<React.PropsWithChildren>
  Footer: React.FC<React.PropsWithChildren>
} = ({
  show = false,
  children,
  onClose,
  size = "small",
  isDismissable = false,
  isKeyboardDismissDisabled = false,
  ref,
}) => {
  const modalId = useId()

  return (
    <ModalOverlay
      isOpen={show}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose()
        }
      }}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      className={cn(
        "fixed inset-0 z-60 bg-gray-900/50",
        "flex items-center justify-center",
        // "data-[entering]:animate-backdrop-fade-in",
      )}
    >
      <AriaModal
        className={cn(
          "fixed z-70 w-full",
          size === "large" && "max-w-155 md:w-155",
          size === "small" && "max-w-105 md:w-105",
          size === "x-small" && "max-w-80 md:w-80",
        )}
        data-testid="modal"
      >
        <AriaDialog
          className={cn(
            "bg-white rounded-md shadow-xl",
            "max-h-[90vh] flex flex-col",
            "outline-none",
          )}
          aria-labelledby={`${modalId}-title`}
        >
          <div ref={ref} className="contents">
            <ModalContext.Provider value={{ onClose, modalId }}>
              {children}
            </ModalContext.Provider>
          </div>
        </AriaDialog>
      </AriaModal>
    </ModalOverlay>
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
