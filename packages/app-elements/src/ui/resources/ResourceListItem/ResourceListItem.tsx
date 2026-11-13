import { type JSX, type ReactNode, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useTokenProvider } from "#providers/TokenProvider"
import { Icon } from "#ui/atoms/Icon"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Text } from "#ui/atoms/Text"
import { ListItem, type ListItemProps } from "#ui/composite/ListItem"
import {
  customerToProps,
  orderToProps,
  returnToProps,
  shipmentToProps,
  skuListItemToProps,
  stockTransferToProps,
} from "#ui/resources/ResourceListItem/transformers"
import { ResourceStatusBadge } from "#ui/resources/ResourceStatusBadge"
import { promotionToProps } from "./transformers/promotions"
import type {
  ResourceListItemComponentProps,
  ResourceListItemType,
} from "./types"

export interface ResourceListItemProps {
  /**
   * Resource object used to generate list item content depending on its own type.
   *
   * Customers, stock transfers and promotions are deprecated: their lists moved
   * to `useResourceTable`, and they will be removed in a future major release.
   */
  resource: ResourceListItemType
  /**
   * Optional href
   */
  href?: ListItemProps["href"]
  /**
   * Optional onClick function
   */
  onClick?: ListItemProps["onClick"]
  /**
   * Optional setting to show right content, if available.
   */
  showRightContent?: boolean
  /**
   * Optional override for the right slot. When provided, it replaces any computed right content.
   */
  rightContentOverride?: JSX.Element | null
  /**
   * Rendered at the far right of the row, after the right content — a dropdown
   * with what can be done to the resource, typically. A row with actions is
   * usually not clickable itself: the menu is where the links live. It also
   * takes the caret's place, should the row be clickable too.
   */
  actions?: ReactNode
}

const deprecatedTypes: ReadonlyArray<ResourceListItemType["type"]> = [
  "customers",
  "stock_transfers",
  "buy_x_pay_y_promotions",
  "external_promotions",
  "fixed_amount_promotions",
  "fixed_price_promotions",
  "free_gift_promotions",
  "free_shipping_promotions",
  "percentage_discount_promotions",
  "flex_promotions",
]

// one warning per type is enough: a list renders the same type many times
const warnedTypes = new Set<ResourceListItemType["type"]>()

function warnIfDeprecated(type: ResourceListItemType["type"]): void {
  if (!deprecatedTypes.includes(type) || warnedTypes.has(type)) {
    return
  }

  warnedTypes.add(type)
  console.warn(
    `ResourceListItem: "${type}" is deprecated and will be removed in a future major release. List it with \`useResourceTable\` instead.`,
  )
}

type ResourceListItemConfig = Omit<ResourceListItemProps, "resource"> &
  ResourceListItemComponentProps

const ResourceListItemComponent = withSkeletonTemplate<ResourceListItemConfig>(
  ({
    name,
    description,
    icon,
    rightContent,
    rightContentOverride,
    bottomContent,
    href,
    onClick,
    alignItems,
    showRightContent = false,
    invertNameDescription = false,
    status,
    actions,
  }) => {
    // a row with actions has its menu where the caret would go, and the menu is
    // where the row leads
    const showCaret = (href != null || onClick != null) && actions == null

    return (
      <ListItem
        icon={icon}
        alignItems={alignItems ?? (showRightContent ? "center" : "top")}
        data-testid="ResourceListItem"
        href={href}
        onClick={onClick}
      >
        <div>
          <div
            className={`flex  ${invertNameDescription ? "flex-col-reverse" : "flex-col"}`}
          >
            <div className="flex items-center gap-2 leading-6">
              <Text
                tag="div"
                weight="semibold"
                data-testid="ResourceListItem-number"
                size="small"
              >
                {name}
              </Text>
              {status != null && <ResourceStatusBadge status={status} />}
            </div>
            <Text
              tag="div"
              weight="medium"
              size="x-small"
              variant="info"
              data-testid="ResourceListItem-content"
            >
              {description}
            </Text>
          </div>
          {bottomContent && <div className="mt-2">{bottomContent}</div>}
        </div>
        <div className="flex items-center gap-2">
          <div>
            {rightContentOverride != null
              ? rightContentOverride
              : showRightContent && rightContent}
          </div>
          {showCaret && (
            // muted and set apart from the right content: it hints that the
            // row leads somewhere, it is not one more value to read
            <Icon
              name="caretRight"
              size={16}
              className="shrink-0 ml-2 text-gray-400 print:hidden"
              data-testid="ResourceListItem-caret"
            />
          )}
          {actions}
        </div>
      </ListItem>
    )
  },
)

/**
 * This component generates a list item based on the requested resource data and type.
 */
export const ResourceListItem = withSkeletonTemplate<ResourceListItemProps>(
  ({ resource, isLoading, delayMs, href, onClick, ...rest }) => {
    const { user } = useTokenProvider()
    const { t } = useTranslation()

    const listItemProps = useMemo(() => {
      warnIfDeprecated(resource.type)

      switch (resource.type) {
        case "customers":
          return customerToProps({ resource, user, t })
        case "orders":
          return orderToProps({ resource, user, t })
        case "returns":
          return returnToProps({ resource, user, t })
        case "stock_transfers":
          return stockTransferToProps({ resource, user, t })
        case "shipments":
          return shipmentToProps({ resource, user, t })
        case "sku_list_items":
          return skuListItemToProps({ resource, user, t })
        case "buy_x_pay_y_promotions":
        case "external_promotions":
        case "fixed_amount_promotions":
        case "fixed_price_promotions":
        case "free_gift_promotions":
        case "free_shipping_promotions":
        case "percentage_discount_promotions":
        case "flex_promotions":
          return promotionToProps({ resource, user, t })
      }
    }, [resource])
    return (
      <ResourceListItemComponent
        {...listItemProps}
        isLoading={isLoading}
        href={href}
        onClick={onClick}
        {...rest}
      />
    )
  },
)
