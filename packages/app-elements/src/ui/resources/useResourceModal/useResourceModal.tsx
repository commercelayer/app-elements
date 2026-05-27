import type { ListableResourceType } from "@commercelayer/sdk"
import { type FC, useCallback, useState } from "react"
import { Spacer } from "#ui/atoms/Spacer"
import { Tab, Tabs } from "#ui/atoms/Tabs"
import { Modal } from "#ui/composite/Modal"
import { ResourceAttributes } from "./ResourceAttributes"
import { ResourceEvents } from "./ResourceEvents"

export interface UseResourceModalConfig {
  /**
   * The resource type to be fetched.
   */
  resourceType: ListableResourceType
  /**
   * The resource ID to be fetched.
   */
  resourceId: string
  /**
   * Optional title for the modal. If not provided, a default title will be used.
   */
  title?: string
}

interface UseResourceModalReturn {
  openResourceModal: () => void
  closeResourceModal: () => void
  ResourceModal: FC
}

export function useResourceModal({
  resourceType,
  resourceId,
  title,
}: UseResourceModalConfig): UseResourceModalReturn {
  const [show, setShow] = useState(false)

  const openResourceModal = useCallback(() => {
    setShow(true)
  }, [])

  const closeResourceModal = useCallback(() => {
    setShow(false)
  }, [])

  const ResourceModal = useCallback<FC>(() => {
    return (
      <Modal show={show} onClose={closeResourceModal} size="large">
        <Modal.Header>{title ?? "Resource Details"}</Modal.Header>
        <Modal.Body>
          <div className="h-[50dvh]">
            <Spacer top="2">
              <Tabs>
                <Tab name="Attributes">
                  <ResourceAttributes
                    resourceType={resourceType}
                    resourceId={resourceId}
                  />
                </Tab>
                <Tab name="Events">
                  <ResourceEvents
                    resourceType={resourceType}
                    resourceId={resourceId}
                  />
                </Tab>
              </Tabs>
            </Spacer>
          </div>
        </Modal.Body>
      </Modal>
    )
  }, [closeResourceModal, show, resourceType, resourceId, title])

  return {
    openResourceModal,
    closeResourceModal,
    ResourceModal,
  }
}
