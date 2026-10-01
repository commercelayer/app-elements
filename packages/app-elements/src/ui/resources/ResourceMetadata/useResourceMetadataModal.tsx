import { type ReactNode, useCallback, useState } from "react"
import { FormProvider } from "react-hook-form"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Modal } from "#ui/composite/Modal"
import type { ResourceMetadataProps } from "./ResourceMetadata"
import { useResourceMetadataForm } from "./useResourceMetadataForm"

export interface ResourceMetadataModalProps {
  /**
   * Optional heading for the modal, replacing the default `Edit metadata`
   */
  title?: string
  resourceId: ResourceMetadataProps["resourceId"]
  resourceType: ResourceMetadataProps["resourceType"]
}

interface ResourceMetadataModalHook {
  /** The modal itself — render it as is, its visibility is driven by the hook */
  metadataModal: ReactNode
  /** Opens the modal, when the user is allowed to */
  openMetadataModal: () => void
}

export function useResourceMetadataModal({
  title,
  resourceId,
  resourceType,
}: ResourceMetadataModalProps): ResourceMetadataModalHook {
  const { canUser } = useTokenProvider()
  const [isOpen, setIsOpen] = useState(false)

  const canEditMetadata = canUser("update", resourceType)

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const openMetadataModal = useCallback(() => {
    if (canEditMetadata) {
      setIsOpen(true)
    }
  }, [canEditMetadata])

  const { methods, onSubmit, fields, footer } = useResourceMetadataForm({
    resourceId,
    resourceType,
    isOpen,
    onSubmitted: close,
    onCancel: close,
  })

  return {
    // an element rather than a component: React then reconciles it by type on
    // every render, so the `Modal` is updated in place instead of being
    // remounted — a remount would skip the cleanup that releases the body
    // scroll lock, leaving the page stuck
    metadataModal: canEditMetadata ? (
      // no DOM of its own, so it can span the modal's slots and let the submit
      // button in the footer drive the fields in the body
      <FormProvider {...methods}>
        <Modal
          show={isOpen}
          onClose={close}
          size="large"
          dismissible
          onSubmit={onSubmit}
        >
          <Modal.Header>
            {title ??
              t("common.edit_resource", {
                resource: t("common.metadata").toLowerCase(),
              })}
          </Modal.Header>
          <Modal.Body>{fields}</Modal.Body>
          <Modal.Footer>{footer}</Modal.Footer>
        </Modal>
      </FormProvider>
    ) : null,
    openMetadataModal,
  }
}
