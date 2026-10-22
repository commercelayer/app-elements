import type {
  CommerceLayerClient,
  ListableResourceType,
  TaggableResourceType,
} from "@commercelayer/sdk"
import isEmpty from "lodash-es/isEmpty"
import { isMockedId } from "#helpers/mocks"
import { useCoreApi, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Button } from "#ui/atoms/Button"
import { Section } from "#ui/atoms/Section"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Tag as TagUi } from "#ui/atoms/Tag"
import { Text } from "#ui/atoms/Text"
import { useSurfaceVariant } from "#ui/internals/overlayContext"
import {
  type ResourceTagsModalProps,
  useResourceTagsModal,
} from "./useResourceTagsModal"

export type TaggableResource = TaggableResourceType

/**
 * Whether the API can tag this resource — `ResourceAdminBlocks` leaves the Tags
 * block out for a stock item or an import.
 *
 * The SDK declares an `isTaggable()` helper and a `taggableResources` array, but
 * ships them only from its `enum` entrypoint, which isn't in the package's public
 * `exports` map, so importing them throws. Rather than hand-maintain that list
 * ourselves, we ask the client instance directly: a resource is taggable exactly
 * when its endpoint exposes a `tags()` method. Reading the client makes this a
 * hook rather than a plain function — call it unconditionally, like any other.
 */

export function isTaggableResource(
  resourceType: ListableResourceType,
  sdkClient: CommerceLayerClient,
): resourceType is TaggableResource {
  return (
    typeof (sdkClient[resourceType] as { tags?: unknown })?.tags === "function"
  )
}

export function useIsTaggableResource(
  resourceType: ListableResourceType,
): resourceType is TaggableResource {
  const { sdkClient } = useCoreSdkProvider()
  return isTaggableResource(resourceType, sdkClient)
}

interface TagsModal
  extends Omit<ResourceTagsModalProps, "resourceId" | "resourceType"> {}

export interface ResourceTagsProps {
  /**
   * How the block renders, overriding what it infers from where it sits.
   *
   * Inferred by default — `PageLayout`'s sidebar slot reports `"sidebar"`, while a
   * page and a drawer both report the wider `"default"`. Pass it only to force a
   * rendering the surrounding surface would not choose.
   */
  variant?: "default" | "sidebar"
  resourceType: TaggableResource
  resourceId: string
  /**
   * Edit modal configuration
   */
  modal?: TagsModal
  /**
   * Optional onTagClick function to define the click behavior of single tag in visualization
   */
  onTagClick?: (tagId: string) => void
}

/**
 * This component generates an all-in-one visualization and editing interface for managing tags relationship of requested resource.
 */
export const ResourceTags = withSkeletonTemplate<ResourceTagsProps>(
  ({ resourceType, resourceId, modal, onTagClick, variant }) => {
    // the hook runs unconditionally; the prop only wins afterwards
    const inferredSurface = useSurfaceVariant()
    // no rendering of their own for a modal: they lay out as on a page
    const surface =
      variant ?? (inferredSurface === "sidebar" ? "sidebar" : "default")
    const { data: resourceTags } = useCoreApi(
      resourceType,
      "tags",
      resourceId == null || isEmpty(resourceId) || isMockedId(resourceId)
        ? null
        : [
            resourceId,
            {
              fields: ["id", "name"],
              pageSize: 25,
            },
          ],
    )

    const { tagsModal, openTagsModal } = useResourceTagsModal({
      title: modal?.title,
      showManageAction: modal?.showManageAction,
      resourceId,
      resourceType,
    })

    const { canUser } = useTokenProvider()

    return (
      <Section
        surface={surface}
        title="Tags"
        actionButton={
          canUser("update", resourceType) && (
            <Button
              variant="secondary"
              size="mini"
              className="print:hidden"
              aria-label={t("common.edit_resource", {
                resource: t("resources.tags.name").toLowerCase(),
              })}
              onClick={() => {
                openTagsModal()
              }}
            >
              {t("common.edit")}
            </Button>
          )
        }
      >
        {resourceTags == null || resourceTags.length === 0 ? (
          <Spacer top="4">
            <Text variant="info" size="small">
              {t("common.no_resources.no_tags")}
            </Text>
          </Spacer>
        ) : (
          <div className="flex flex-wrap gap-2 mt-4">
            {resourceTags.map((tag, idx) => {
              if (onTagClick != null) {
                return (
                  <TagUi
                    className="print:border"
                    // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
                    key={idx}
                    onClick={() => {
                      onTagClick(tag.id)
                    }}
                  >
                    {tag.name}
                  </TagUi>
                )
              }
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
              return <TagUi key={idx}>{tag.name}</TagUi>
            })}
          </div>
        )}
        {tagsModal}
      </Section>
    )
  },
)

ResourceTags.displayName = "ResourceTags"
