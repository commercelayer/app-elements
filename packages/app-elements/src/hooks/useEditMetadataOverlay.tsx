import { type FC, useCallback } from "react"
import { useOverlay } from "#hooks/useOverlay"
import { useTranslation } from "#providers/I18NProvider"
import { PageLayout } from "#ui/composite/PageLayout"
import type { ResourceMetadataProps } from "#ui/resources/ResourceMetadata"
import { ResourceMetadataForm } from "#ui/resources/ResourceMetadata/ResourceMetadataForm"

export interface EditMetadataOverlayProps {
  /**
   * Optional title shown as first line in edit overlay heading
   */
  title?: string
  resourceId: ResourceMetadataProps["resourceId"]
  resourceType: ResourceMetadataProps["resourceType"]
}

interface MetadataOverlayHook {
  show: () => void
  Overlay: FC<EditMetadataOverlayProps>
}

export function useEditMetadataOverlay(): MetadataOverlayHook {
  const { Overlay: OverlayElement, open, close } = useOverlay()
  const { t } = useTranslation()

  const OverlayComponent = useCallback<FC<EditMetadataOverlayProps>>(
    ({ title = "Back", resourceId, resourceType }) => {
      return (
        <OverlayElement backgroundColor="light">
          <PageLayout
            title={t("common.edit", {
              resource: t("common.metadata").toLowerCase(),
            })}
            minHeight={false}
            navigationButton={{
              label: title,
              icon: "arrowLeft",
              onClick: () => {
                close()
              },
            }}
          >
            <ResourceMetadataForm
              resourceId={resourceId}
              resourceType={resourceType}
              onSubmitted={() => {
                close()
              }}
            />
          </PageLayout>
        </OverlayElement>
      )
    },
    [OverlayElement],
  )

  return {
    show: open,
    Overlay: OverlayComponent,
  }
}
