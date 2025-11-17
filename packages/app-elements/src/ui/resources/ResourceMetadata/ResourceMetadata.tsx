import type { ListableResourceType } from "@commercelayer/sdk"
import { isMockedId } from "#helpers/mocks"
import {
  type EditMetadataOverlayProps,
  useEditMetadataOverlay,
} from "#hooks/useEditMetadataOverlay"
import { useViewJsonOverlay } from "#hooks/useViewJsonOverlay"
import { useCoreApi } from "#providers/CoreSdkProvider"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Button } from "#ui/atoms/Button"
import { Card } from "#ui/atoms/Card"
import { Icon } from "#ui/atoms/Icon"
import { Section } from "#ui/atoms/Section"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Text } from "#ui/atoms/Text"

interface MetadataOverlay
  extends Omit<EditMetadataOverlayProps, "resourceId" | "resourceType"> {}

export interface ResourceMetadataProps {
  resourceType: ListableResourceType
  resourceId: string
  /**
   * Edit overlay configuration
   */
  overlay?: MetadataOverlay
}

export const updatableTypes = ["string", "number", "boolean"] as const
export type UpdatableType = (typeof updatableTypes)[number]

export const isUpdatableType = (value: any): value is UpdatableType => {
  return updatableTypes.includes(typeof value as UpdatableType)
}

/**
 * This component provides an all-in-one visualization and editing interface for the `metadata` attribute of a given resource.
 * More in detail the `metadata` attribute is a JSON object, customizable for several purposes, and this component will allow to show and manage its keys with a simple (string kind) values.
 */
export const ResourceMetadata = withSkeletonTemplate<ResourceMetadataProps>(
  ({ resourceType, resourceId, overlay }) => {
    const { Overlay: EditMetadataOverlay, show } = useEditMetadataOverlay()
    const { JsonOverlay, showJsonOverlay } = useViewJsonOverlay()

    const { canUser } = useTokenProvider()

    const { data: resourceData, isLoading } = useCoreApi(
      resourceType,
      "retrieve",
      isMockedId(resourceId)
        ? null
        : [
            resourceId,
            {
              fields: ["metadata"],
            },
          ],
    )

    if (isLoading) {
      return null
    }

    return (
      <div>
        <Section
          title="Metadata"
          border="none"
          actionButton={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="mini"
                onClick={() => {
                  showJsonOverlay()
                }}
              >
                {t("common.view_json")}
              </Button>
              {canUser("update", resourceType) && (
                <Button
                  variant="secondary"
                  size="mini"
                  alignItems="center"
                  aria-label={t("common.edit_resource", {
                    resource: t("common.metadata").toLowerCase(),
                  })}
                  onClick={() => {
                    show()
                  }}
                >
                  <Icon name="pencilSimple" size="16" />
                  {t("common.edit")}
                </Button>
              )}
            </div>
          }
        >
          <Card gap="6" overflow="visible" backgroundColor="light">
            {Object.entries(resourceData?.metadata ?? []).map(
              ([metadataKey, metadataValue], idx) => {
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
                    key={idx}
                    className="flex w-full px-1"
                    data-testid={`ResourceMetadata-item-${metadataKey}`}
                  >
                    <Text
                      size="small"
                      variant="info"
                      className="font-mono mr-2"
                    >
                      {metadataKey}:
                    </Text>
                    <Text
                      size="small"
                      className="font-mono"
                      data-testid={`ResourceMetadata-value-${metadataKey}`}
                    >
                      {isUpdatableType(metadataValue)
                        ? metadataValue.toString()
                        : "[...]"}
                    </Text>
                  </div>
                )
              },
            )}
          </Card>
        </Section>
        <JsonOverlay title="Metadata" json={resourceData?.metadata ?? {}} />
        <EditMetadataOverlay
          title={overlay?.title}
          resourceId={resourceId}
          resourceType={resourceType}
        />
      </div>
    )
  },
)
