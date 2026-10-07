import { type ReactNode, useCallback, useState } from "react"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Modal } from "#ui/composite/Modal"
import type { ResourceTagsProps } from "./ResourceTags"
import { useResourceTagsForm } from "./useResourceTagsForm"

export interface ResourceTagsModalProps {
  /**
   * Optional heading for the modal, replacing the default `Edit tags`
   */
  title?: string
  /**
   * Optional setting to define if tags app management link is to be shown in the modal footer
   */
  showManageAction?: boolean
  resourceId: ResourceTagsProps["resourceId"]
  resourceType: ResourceTagsProps["resourceType"]
}

interface ResourceTagsModalHook {
  /** The modal itself — render it as is, its visibility is driven by the hook */
  tagsModal: ReactNode
  /** Opens the modal, when the user is allowed to */
  openTagsModal: () => void
}

export function useResourceTagsModal({
  title,
  showManageAction,
  resourceId,
  resourceType,
}: ResourceTagsModalProps): ResourceTagsModalHook {
  const { canUser } = useTokenProvider()
  const [isOpen, setIsOpen] = useState(false)
  // State rather than a ref: the select is rendered on the same pass as the
  // modal, so it needs a re-render once the dialog element exists to pick it up
  // as its portal target.
  const [dialogElement, setDialogElement] = useState<HTMLDialogElement | null>(
    null,
  )

  const canEditTags = canUser("update", resourceType)

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const openTagsModal = useCallback(() => {
    if (canEditTags) {
      setIsOpen(true)
    }
  }, [canEditTags])

  const { onSubmit, fields, footer } = useResourceTagsForm({
    resourceId,
    resourceType,
    isOpen,
    menuPortalTarget: dialogElement,
    showManageAction,
    onSubmitted: close,
    onCancel: close,
  })

  return {
    // an element rather than a component: React then reconciles it by type on
    // every render, so the `Modal` is updated in place instead of being
    // remounted — a remount would skip the cleanup that releases the body
    // scroll lock, leaving the page stuck
    tagsModal: canEditTags ? (
      <Modal
        show={isOpen}
        onClose={close}
        size="medium"
        dialogRef={setDialogElement}
        dismissible
        onSubmit={onSubmit}
      >
        <Modal.Header>
          {title ??
            t("common.edit_resource", {
              resource: t("resources.tags.name_other").toLowerCase(),
            })}
        </Modal.Header>
        <Modal.Body>{fields}</Modal.Body>
        <Modal.Footer>{footer}</Modal.Footer>
      </Modal>
    ) : null,
    openTagsModal,
  }
}
