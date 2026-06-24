import { type FC, useCallback, useRef, useState } from "react"
import { parseApiError } from "#helpers/errors"
import { Button, type ButtonProps } from "#ui/atoms/Button"
import { Icon, type IconProps } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Modal } from "#ui/composite/Modal"
import { toast } from "#ui/composite/Toast"

interface ConfirmDialogConfirmProps {
  /** Label for the confirm button */
  label: string
  /** Button variant. Use `"danger"` for destructive actions and `"primary"` for generic confirmations. */
  variant?: ButtonProps["variant"]
  /** Async action to execute on confirm */
  onClick: () => Promise<unknown>
}

interface ConfirmDialogProps {
  /** Controls visibility of the dialog */
  show: boolean
  /** Called when the dialog should close */
  onClose: () => void
  /** Icon name to display at the top of the dialog (from the Icon component set) */
  icon: IconProps["name"]
  /** Main title shown in the dialog body. */
  title: string
  /** Optional extra content rendered below the title. */
  description?: React.ReactNode
  /** Configuration for the confirm (primary action) button */
  confirm: ConfirmDialogConfirmProps
  /** Optional label for the cancel button - Default "Cancel" */
  cancelLabel?: string
  /**
   * Message shown in the error toast when `confirm.onClick` rejects and overrides the API errors.
   */
  errorMessage?: string
  /** Optional success message shown when the action completes successfully */
  successMessage?: string
  /**
   * Toast variant used for the success message. Defaults to `"default"`.
   */
  successVariant?: "default" | "success" | "error"
}

/**
 * Blocking confirmation dialog built on top of `Modal`.
 * The user can only interact via the confirm or cancel buttons — backdrop clicks and
 * Escape key are disabled. Both buttons are disabled while the async confirm action
 * is pending. On error the dialog closes and an error toast is shown automatically.
 */
const ConfirmDialog: FC<ConfirmDialogProps> = ({
  show,
  onClose,
  icon,
  title,
  description,
  confirm,
  cancelLabel = "Cancel",
  errorMessage,
  successMessage,
  successVariant = "default",
}) => {
  const [isPending, setIsPending] = useState(false)

  const handleConfirm = async (): Promise<void> => {
    if (isPending) return
    setIsPending(true)
    try {
      await confirm.onClick()
      if (successMessage) {
        toast(successMessage, { type: successVariant })
      }
    } catch (err) {
      const parsedMessage = parseApiError(err)
        .map((e) => e.detail)
        .join(". ")
      const msg =
        errorMessage ?? (parsedMessage.trim() || "Something went wrong")
      toast(msg, { type: "error" })
    } finally {
      setIsPending(false)
      onClose()
    }
  }

  const handleCancel = (): void => {
    if (isPending) return
    onClose()
  }

  return (
    <Modal show={show} onClose={onClose} size="x-small">
      <Modal.Body>
        <div className="flex flex-col items-center text-center">
          <Icon name={icon} size={32} className="mt-3.5 mb-4 text-gray-400" />
          <Text weight="medium" className="text-balance">
            {title}
          </Text>
          <Text variant="info" size="small">
            {description}
          </Text>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={confirm.variant ?? "primary"}
          onClick={() => void handleConfirm()}
          disabled={isPending}
          fullWidth
        >
          {confirm.label}
        </Button>
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={isPending}
          fullWidth
        >
          {cancelLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

type ConfirmDialogRendererProps = Omit<ConfirmDialogProps, "show" | "onClose">

interface ConfirmDialogHook {
  /**
   * Opens the dialog.
   */
  show: () => void
  /**
   * The dialog renderer. Mount it in your component tree and pass it the
   * `icon`, `title`, `description`, `confirm` (and optional `errorMessage`) props.
   * Visibility is fully managed by the hook — you only need to call `show()`.
   *
   * @example
   * const { show, ConfirmDialog } = useConfirmDialog()
   *
   * return (
   *     <>
   *       <Button onClick={show}>Delete</Button>
   *       <ConfirmDialog
   *        icon="trash"
   *        title="Delete item"
   *        description="Are you sure you want to delete this item?"
   *        confirm={{ label: "Delete", variant: "danger", onClick: handleDelete }}
   *       />
   *     </>
   * )
   */
  ConfirmDialog: FC<ConfirmDialogRendererProps>
}

export function useConfirmDialog(): ConfirmDialogHook {
  const [isOpen, setIsOpen] = useState(false)

  // Kept in sync on every render so the renderer below can read the latest
  // value without being recreated (see comment further down).
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Identity must stay stable across the hook's lifetime: if it changed
  // whenever `isOpen` changed (e.g. via `useCallback(..., [isOpen, close])`),
  // React would treat it as a new component type on every open/close and
  // remount the underlying `Modal` instead of just re-rendering it. That
  // remount happens mid-open, before the cleanup that restores
  // `document.body.style.overflow` can run, leaving the page stuck unscrollable.
  const ConfirmDialogRendererRef = useRef<
    FC<ConfirmDialogRendererProps> | undefined
  >(undefined)
  ConfirmDialogRendererRef.current ??= (props) => (
    <ConfirmDialog {...props} show={isOpenRef.current} onClose={close} />
  )

  return {
    show: open,
    ConfirmDialog: ConfirmDialogRendererRef.current,
  }
}
