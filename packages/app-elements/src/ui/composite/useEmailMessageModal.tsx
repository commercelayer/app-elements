import { type ReactNode, useCallback, useState } from "react"
import { t } from "#providers/i18n"
import { A } from "#ui/atoms/A"
import { Spacer } from "#ui/atoms/Spacer"
import { EmailMessage } from "./EmailMessage"
import { Modal } from "./Modal"

interface EmailMessageModalHook {
  /** The modal itself — render it as is, its visibility is driven by the hook */
  emailModal: ReactNode
  /** Opens the modal */
  openEmailModal: () => void
}

/**
 * An email in a modal of its own, with a link to download the raw message
 * below it: the one way an email is viewed across the apps, wherever the
 * button that opens it sits. It can open over another modal.
 */
export const useEmailMessageModal = ({
  src,
}: {
  /**
   * Where the raw message can be fetched from, as `EmailMessage` takes it.
   * Without one there is nothing to show, and `emailModal` is `null`.
   */
  src: string | null | undefined
}): EmailMessageModalHook => {
  const [isOpen, setIsOpen] = useState(false)

  const openEmailModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  return {
    emailModal:
      src == null ? null : (
        <Modal
          show={isOpen}
          onClose={() => {
            setIsOpen(false)
          }}
          size="large"
          // read-only, so nothing is lost by closing it from the backdrop or
          // with Escape — which, over another modal, closes this one only
          dismissible
        >
          <Modal.Header>{t("common.email_message.title")}</Modal.Header>
          <Modal.Body>
            {/* mounted only while open: the message is fetched on opening, and
              a signed URL to it expires */}
            {isOpen && <EmailMessage src={src} />}
            <Spacer top="8">
              <A href={src} target="_blank" rel="noreferrer">
                {t("common.email_message.download")}
              </A>
            </Spacer>
          </Modal.Body>
        </Modal>
      ),
    openEmailModal,
  }
}
