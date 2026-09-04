import { type JSX, type ReactNode, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useTokenProvider } from "#providers/TokenProvider"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { StatusIcon } from "#ui/atoms/StatusIcon"
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
   * Resource object used to generate list item content depending on its own type
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
   * Optional setting to show right content, if available, instead of right arrow
   */
  showRightContent?: boolean
  /**
   * Optional override for the right slot. When provided, it replaces any computed right content.
   */
  rightContentOverride?: JSX.Element | null
  /**
   * Rendered at the far right of the row, after the right content — a dropdown
   * with what can be done to the resource, typically. A row with actions is
   * usually not clickable itself: the menu is where the links live.
   */
  actions?: ReactNode
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
    const isClickable = href != null || onClick != null

    return (
      <ListItem
        icon={icon}
        alignItems={alignItems ?? (showRightContent ? "center" : "top")}
        data-testid="ResourceListItem"
        href={href}
        onClick={onClick}
        padding={isClickable ? "xy" : "y"}
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
              : showRightContent
                ? rightContent
                : isClickable && <StatusIcon name="caretRight" />}
          </div>
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
