import type { ReactNode } from "react"
import { useCallback, useMemo, useState } from "react"
import { t } from "#providers/I18NProvider"
import { Modal } from "#ui/composite/Modal"
import {
  ResourceDetailsContent,
  type ResourceDetailsContentProps,
} from "./ResourceDetailsContent"

/** Height of a tab panel inside the modal, so the modal can't resize between tabs. */
const PANEL_HEIGHT = "70vh"

export interface UseResourceDetailsModalProps
  extends Omit<ResourceDetailsContentProps, "panelHeight"> {
  /** Modal heading. Defaults to a generic "Resource details". */
  title?: string
}

export interface UseResourceDetailsModalReturn {
  /** Render this wherever the modal should mount. */
  modal: ReactNode
  open: () => void
  close: () => void
}

/**
 * Shows a resource's details in a modal: its attributes, any caller-supplied
 * tabs, and its event stream.
 *
 * The modal is returned as an *element*, not a component. A component created
 * inside this hook would get a fresh identity on every render of the caller,
 * so React would unmount and remount the whole subtree whenever the caller
 * re-rendered (an SWR revalidation on window focus, say), discarding the
 * active tab and repainting the contents.
 */
export function useResourceDetailsModal({
  title,
  ...contentProps
}: UseResourceDetailsModalProps): UseResourceDetailsModalReturn {
  const [show, setShow] = useState(false)

  const open = useCallback(() => {
    setShow(true)
  }, [])

  const close = useCallback(() => {
    setShow(false)
  }, [])

  const { resource, isLoading, tabs } = contentProps

  const modal = useMemo(
    () => (
      <Modal show={show} onClose={close} size="large" dismissible>
        <Modal.Header>
          {title ?? t("common.resource_details.title")}
        </Modal.Header>
        <Modal.Body>
          <ResourceDetailsContent
            resource={resource}
            isLoading={isLoading}
            tabs={tabs}
            panelHeight={PANEL_HEIGHT}
          />
        </Modal.Body>
      </Modal>
    ),
    [show, close, title, resource, isLoading, tabs],
  )

  return { modal, open, close }
}
