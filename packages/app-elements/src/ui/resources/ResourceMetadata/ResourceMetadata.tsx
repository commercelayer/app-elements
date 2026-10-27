import type { ListableResourceType } from "@commercelayer/sdk"
import { isEmpty } from "lodash-es"
import { isMockedId } from "#helpers/mocks"
import { useViewJsonOverlay } from "#hooks/useViewJsonOverlay"
import { useCoreApi } from "#providers/CoreSdkProvider"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Button } from "#ui/atoms/Button"
import { Card } from "#ui/atoms/Card"
import { Icon } from "#ui/atoms/Icon"
import { Section } from "#ui/atoms/Section"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { useSurfaceVariant } from "#ui/internals/overlayContext"
import {
  type ResourceMetadataModalProps,
  useResourceMetadataModal,
} from "./useResourceMetadataModal"
import { isUpdatableType } from "./utils"

interface MetadataModal
  extends Omit<ResourceMetadataModalProps, "resourceId" | "resourceType"> {}

export interface ResourceMetadataProps {
  /**
   * How the block renders, overriding what it infers from where it sits.
   *
   * Inferred by default — `PageLayout`'s sidebar slot reports `"sidebar"`, while a
   * page and a drawer both report the wider `"default"`. Pass it only to force a
   * rendering the surrounding surface would not choose.
   */
  variant?: "default" | "sidebar"
  resourceType: ListableResourceType
  resourceId: string
  /**
   * Edit modal configuration
   */
  modal?: MetadataModal
}

export {
  isUpdatableType,
  type UpdatableType,
  updatableTypes,
} from "./utils"

/**
 * This component provides an all-in-one visualization and editing interface for the `metadata` attribute of a given resource.
 * More in detail the `metadata` attribute is a JSON object, customizable for several purposes, and this component will allow to show and manage its keys with a simple (string kind) values.
 */
export const ResourceMetadata = withSkeletonTemplate<ResourceMetadataProps>(
  ({ resourceType, resourceId, modal, variant }) => {
    // the hook runs unconditionally; the prop only wins afterwards
    const inferredSurface = useSurfaceVariant()
    // no rendering of their own for a modal: they lay out as on a page
    const surface =
      variant ?? (inferredSurface === "sidebar" ? "sidebar" : "default")
    const { metadataModal, openMetadataModal } = useResourceMetadataModal({
      title: modal?.title,
      resourceId,
      resourceType,
    })
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
          surface={surface}
          title="Metadata"
          actionButton={
            canUser("update", resourceType) && (
              <Button
                variant="secondary"
                size="mini"
                className="print:hidden"
                aria-label={t("common.edit_resource", {
                  resource: t("common.metadata").toLowerCase(),
                })}
                onClick={() => {
                  openMetadataModal()
                }}
              >
                {t("common.edit")}
              </Button>
            )
          }
        >
          <Spacer top="4">
            {!isEmpty(resourceData?.metadata) ? (
              <Card
                gap={surface === "sidebar" ? "2" : "6"}
                overflow="visible"
                backgroundColor="light"
                className="print:p-4 print:rounded-sm"
              >
                <div className="relative">
                  <div className="absolute left-0 bottom-0 w-full h-full bg-[linear-gradient(to_bottom,transparent_85%,var(--color-gray-50)_100%)]"></div>
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
                </div>
                <div className="flex mt-2 print:hidden">
                  <Button
                    variant="subtle"
                    size="mini"
                    onClick={() => {
                      showJsonOverlay()
                    }}
                  >
                    <Icon name="eye" weight="bold" />
                    {t("common.view_json")}
                  </Button>
                </div>
              </Card>
            ) : (
              <Text tag="span" variant="info" size="small">
                {t("common.no_metadata")}
              </Text>
            )}
          </Spacer>
        </Section>
        <JsonOverlay title="Metadata" json={resourceData?.metadata ?? {}} />
        {metadataModal}
      </div>
    )
  },
)
