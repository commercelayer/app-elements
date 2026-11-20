import type { ReactNode } from "react"
import { useCallback, useMemo, useState } from "react"
import { t } from "#providers/i18n"
import { Modal } from "#ui/composite/Modal"
import {
  ResourceDetailsContent,
  type ResourceDetailsContentProps,
} from "./ResourceDetailsContent"

/**
 * Height of the modal, whatever tab is open: 70% of the window plus the header
 * and spacing, between 480px and 755px.
 */
const MODAL_HEIGHT = "clamp(480px, calc(70vh + 75px), 755px)"

export interface UseResourceDetailsModalProps
  extends Omit<
    ResourceDetailsContentProps,
    "panelHeight" | "tabsSize" | "edgeToEdge"
  > {
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
 * Shows a resource's details in a modal: its attributes, its relationships
 * when asked for, any caller-supplied tabs, and its event stream.
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

  const { resource, isLoading, relationships, tabs } = contentProps

  const modal = useMemo(
    () => (
      <Modal
        show={show}
        onClose={close}
        size="large"
        dismissible
        height={MODAL_HEIGHT}
      >
        <Modal.Header>
          {title ?? t("common.resource_details.title")}
        </Modal.Header>
        {/* The tab row runs from edge to edge of the modal, right under its
            header, and brings its own spacing; it stays there while the open
            panel scrolls under it. The modal keeps its height, so switching tabs or opening
            an event does not resize it. */}
        <Modal.Body flush>
          <div className="h-full">
            <ResourceDetailsContent
              resource={resource}
              isLoading={isLoading}
              relationships={relationships}
              tabs={tabs}
              tabsSize="small"
              edgeToEdge
              fillHeight
            />
          </div>
        </Modal.Body>
      </Modal>
    ),
    [show, close, title, resource, isLoading, relationships, tabs],
  )

  return { modal, open, close }
}
