import type { ListableResourceType } from "@commercelayer/sdk"
import { type ReactNode, useCallback, useState } from "react"
import { FormProvider } from "react-hook-form"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Modal } from "#ui/composite/Modal"
import type { ResourceDetailsProps } from "./ResourceDetails"
import { useResourceReferenceForm } from "./useResourceReferenceForm"

export interface ResourceReferenceModalProps {
  /**
   * Optional heading for the modal, replacing the default `Edit reference`
   */
  title?: string
  resource: ResourceDetailsProps["resource"]
  onUpdated: ResourceDetailsProps["onUpdated"]
}

interface ResourceReferenceModalHook {
  /** The modal itself — render it as is, its visibility is driven by the hook */
  referenceModal: ReactNode
  /** Opens the modal, when the user is allowed to */
  openReferenceModal: () => void
}

export function useResourceReferenceModal({
  title,
  resource,
  onUpdated,
}: ResourceReferenceModalProps): ResourceReferenceModalHook {
  const { canUser } = useTokenProvider()
  const [isOpen, setIsOpen] = useState(false)

  const canEditReference = canUser(
    "update",
    resource.type as ListableResourceType,
  )

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const openReferenceModal = useCallback(() => {
    if (canEditReference) {
      setIsOpen(true)
    }
  }, [canEditReference])

  const { methods, onSubmit, fields, footer } = useResourceReferenceForm({
    resource,
    isOpen,
    onSubmitted: async () => {
      await onUpdated()
      close()
    },
    onCancel: close,
  })

  return {
    // an element rather than a component: React then reconciles it by type on
    // every render, so the `Modal` is updated in place instead of being
    // remounted — a remount would skip the cleanup that releases the body
    // scroll lock, leaving the page stuck
    referenceModal: canEditReference ? (
      // no DOM of its own, so it can span the modal's slots and let the submit
      // button in the footer drive the fields in the body
      <FormProvider {...methods}>
        <Modal
          show={isOpen}
          onClose={close}
          size="small"
          dismissible
          onSubmit={onSubmit}
        >
          <Modal.Header>
            {title ??
              t("common.edit_resource", {
                resource: t("common.reference").toLowerCase(),
              })}
          </Modal.Header>
          <Modal.Body>{fields}</Modal.Body>
          <Modal.Footer>{footer}</Modal.Footer>
        </Modal>
      </FormProvider>
    ) : null,
    openReferenceModal,
  }
}
