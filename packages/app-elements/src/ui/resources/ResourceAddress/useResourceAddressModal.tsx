import type { Address } from "@commercelayer/sdk"
import type { ReactNode } from "react"
import { useCallback, useState } from "react"
import { FormProvider } from "react-hook-form"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Modal } from "#ui/composite/Modal"
import type { ResourceAddressProps } from "./ResourceAddress"
import { useResourceAddressForm } from "./useResourceAddressForm"

type Props = Omit<ResourceAddressProps, "editable">

interface ResourceAddressModalHook {
  /** The modal itself — render it as is, its visibility is driven by the hook */
  addressModal: ReactNode
  /** Opens the modal, when the user is allowed to */
  openAddressModal: () => void
}

export const useResourceAddressModal = ({
  title,
  address,
  showBillingInfo,
  requiresBillingInfo,
  showNotes,
  onUpdate,
  onCreate,
}: Props): ResourceAddressModalHook => {
  const { canUser } = useTokenProvider()
  const [isOpen, setIsOpen] = useState(false)

  // with no address yet the form creates one, so it's the create ability that
  // decides whether the modal opens at all
  const canEditAddress = canUser(
    address == null ? "create" : "update",
    "addresses",
  )

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const openAddressModal = useCallback(() => {
    if (canEditAddress) {
      setIsOpen(true)
    }
  }, [canEditAddress])

  const { methods, onSubmit, fields, submitButton } = useResourceAddressForm({
    isOpen,
    address,
    showBillingInfo,
    requiresBillingInfo,
    showNotes,
    onUpdate: (updatedAddress: Address) => {
      onUpdate?.(updatedAddress)
      close()
    },
    onCreate: (createdAddress: Address) => {
      onCreate?.(createdAddress)
      close()
    },
  })

  return {
    // an element rather than a component: React then reconciles it by type on
    // every render, so the `Modal` is updated in place instead of being
    // remounted — a remount would skip the cleanup that releases the body
    // scroll lock, leaving the page stuck
    addressModal: canEditAddress ? (
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
              `${address == null ? t("common.new") : t("common.edit")} ${t("resources.addresses.name").toLowerCase()}`}
          </Modal.Header>
          <Modal.Body>{fields}</Modal.Body>
          <Modal.Footer>{submitButton}</Modal.Footer>
        </Modal>
      </FormProvider>
    ) : null,
    openAddressModal,
  }
}
