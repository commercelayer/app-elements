import type { ListableResourceType } from "@commercelayer/sdk"
import isEmpty from "lodash-es/isEmpty"
import { isMockedId } from "#helpers/mocks"
import {
  type EditTagsOverlayProps,
  useEditTagsOverlay,
} from "#hooks/useEditTagsOverlay"
import { useCoreApi } from "#providers/CoreSdkProvider"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Icon } from "#ui/atoms/Icon"
import { Section } from "#ui/atoms/Section"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Tag as TagUi } from "#ui/atoms/Tag"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import { useSurfaceVariant } from "#ui/internals/overlayContext"

/**
 * The resources the API can tag, as a value so that a caller can ask at runtime —
 * `ResourceAdminBlocks` leaves the block out for a stock item or an import.
 *
 * The SDK declares an `isTaggable()` helper and a `taggableResources` array in its
 * types but ships neither in its build, so calling them typechecks and then throws.
 * Hence our own list, checked against `ListableResourceType` by `satisfies`.
 */
export const taggableResources = [
  "addresses",
  "bundles",
  "coupons",
  "customers",
  "gift_cards",
  "line_items",
  "line_item_options",
  "order_subscriptions",
  "orders",
  "buy_x_pay_y_promotions",
  "external_promotions",
  "fixed_amount_promotions",
  "fixed_price_promotions",
  "flex_promotions",
  "free_gift_promotions",
  "free_shipping_promotions",
  "percentage_discount_promotions",
  "returns",
  "shipments",
  "shipping_methods",
  "sku_options",
  "skus",
] as const satisfies readonly ListableResourceType[]

export type TaggableResource = (typeof taggableResources)[number]

/** Whether the API can tag this resource. */
export function isTaggableResource(
  resourceType: ListableResourceType,
): resourceType is TaggableResource {
  return (taggableResources as readonly string[]).includes(resourceType)
}

interface TagsOverlay
  extends Omit<EditTagsOverlayProps, "resourceId" | "resourceType"> {}

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
   * Edit overlay configuration
   */
  overlay?: TagsOverlay
  /**
   * Optional onTagClick function to define the click behavior of single tag in visualization
   */
  onTagClick?: (tagId: string) => void
}

/**
 * This component generates an all-in-one visualization and editing interface for managing tags relationship of requested resource.
 */
export const ResourceTags = withSkeletonTemplate<ResourceTagsProps>(
  ({ resourceType, resourceId, overlay, onTagClick, variant }) => {
    // the hook runs unconditionally; the prop only wins afterwards
    const inferredSurface = useSurfaceVariant()
    const surface = variant ?? inferredSurface
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

    const { Overlay: EditTagsOverlay, show } = useEditTagsOverlay()

    const { canUser } = useTokenProvider()

    return (
      <Section
        surface={surface}
        title="Tags"
        actionButton={
          canUser("update", resourceType) && (
            // A `…` menu rather than an Edit button, as the tables and the page
            // headings use: the section then looks the same on every surface, which
            // is what lets the surface variants differ by CSS alone.
            <Dropdown
              className="print:hidden"
              dropdownLabel={
                <Icon
                  name="dotsThree"
                  weight="bold"
                  size="16"
                  aria-label={t("common.edit_resource", {
                    resource: t("resources.tags.name").toLowerCase(),
                  })}
                />
              }
              dropdownItems={
                <DropdownItem
                  icon="pencilSimple"
                  label={t("common.edit")}
                  onClick={() => {
                    show()
                  }}
                />
              }
            />
          )
        }
      >
        {resourceTags == null || resourceTags.length === 0 ? (
          <Spacer top="4">
            <Text variant="info" size="small">{t("common.no_resources.no_tags")}.</Text>
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
        <EditTagsOverlay
          resourceId={resourceId}
          resourceType={resourceType}
          title={overlay?.title}
          showManageAction={overlay?.showManageAction}
        />
      </Section>
    )
  },
)

ResourceTags.displayName = "ResourceTags"
