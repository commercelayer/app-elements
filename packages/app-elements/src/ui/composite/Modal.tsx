import * as Ariakit from "@ariakit/react"
import cn from "classnames"
import type React from "react"
import { Icon } from "#ui/atoms/Icon"

export type ModalProps = {
  /** Whether the modal is open */
  show?: boolean
  /** Called when user clicks backdrop or the close button */
  onClose: () => void
  /** Modal content */
  children: React.ReactNode
  /** Max width preset */
  size?: "large" | "small" | "x-small"
  /** Whether to close the modal when clicking on the backdrop */
  closeOnBackdropClick?: boolean
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
  closeOnBackdropClick = false,
}) => {
  return (
    <Ariakit.Dialog
      open={show}
      onClose={onClose}
      hideOnInteractOutside={closeOnBackdropClick}
      backdrop={
        <div className="fixed inset-0 bg-gray-900/90 animate-backdrop-fade-in" />
      }
      className={cn(
        "fixed z-70 w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "bg-white rounded-md shadow-xl max-h-[90vh] flex flex-col",
        size === "large" && "max-w-155 md:w-155",
        size === "small" && "max-w-105 md:w-105",
        size === "x-small" && "max-w-80 md:w-80",
      )}
      data-testid="modal"
    >
      {children}
    </Ariakit.Dialog>
  )
}

Modal.Header = ({ children }) => {
  return (
    <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <Ariakit.DialogHeading className="font-bold leading-tight">
        {children}
      </Ariakit.DialogHeading>
      <Ariakit.DialogDismiss className="p-2 -m-2">
        <Icon name="x" size={16} />
      </Ariakit.DialogDismiss>
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
