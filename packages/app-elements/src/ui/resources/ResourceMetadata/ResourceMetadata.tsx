import type { ListableResourceType } from "@commercelayer/sdk"
import { isEmpty } from "lodash-es"
import { isMockedId } from "#helpers/mocks"
import { useViewJsonOverlay } from "#hooks/useViewJsonOverlay"
import { useCoreApi } from "#providers/CoreSdkProvider"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Card } from "#ui/atoms/Card"
import { Icon } from "#ui/atoms/Icon"
import { Section } from "#ui/atoms/Section"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
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
    const surface = variant ?? inferredSurface
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
            // A `…` menu rather than a row of buttons, as the tables and the page
            // headings use: the section then looks the same on every surface, which
            // is what lets the surface variants differ by CSS alone.
            (!isEmpty(resourceData?.metadata) ||
              canUser("update", resourceType)) && (
              <Dropdown
                className="print:hidden"
                dropdownLabel={
                  <Icon
                    name="dotsThree"
                    weight="bold"
                    size="16"
                    aria-label={t("common.edit_resource", {
                      resource: t("common.metadata").toLowerCase(),
                    })}
                  />
                }
                dropdownItems={
                  <>
                    {canUser("update", resourceType) && (
                      <DropdownItem
                        icon="pencilSimple"
                        label={`${t("common.edit")} ${t("common.metadata").toLowerCase()}`}
                        onClick={() => {
                          openMetadataModal()
                        }}
                      />
                    )}
                    {!isEmpty(resourceData?.metadata) && (
                      <DropdownItem
                        icon="code"
                        label={t("common.view_json")}
                        onClick={() => {
                          showJsonOverlay()
                        }}
                      />
                    )}
                  </>
                }
              />
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
