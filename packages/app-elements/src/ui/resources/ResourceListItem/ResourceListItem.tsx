import { useTokenProvider } from '#providers/TokenProvider'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'
import { ListItem, type ListItemProps } from '#ui/composite/ListItem'
import {
  customerToProps,
  orderToProps,
  returnToProps,
  shipmentToProps,
  skuListItemToProps,
  stockTransferToProps
} from '#ui/resources/ResourceListItem/transformers'
import { useMemo } from 'react'
import { promotionToProps } from './transformers/promotions'
import {
  type ResourceListItemComponentProps,
  type ResourceListItemType
} from './types'

export interface ResourceListItemProps {
  /**
   * Resource object used to generate list item content depending on its own type
   */
  resource: ResourceListItemType
  /**
   * Optional href
   */
  href?: ListItemProps['href']
  /**
   * Optional onClick function
   */
  onClick?: ListItemProps['onClick']
  /**
   * Optional setting to show right content, if available, instead of right arrow
   */
  showRightContent?: boolean
}

type ResourceListItemConfig = Omit<ResourceListItemProps, 'resource'> &
  ResourceListItemComponentProps

const ResourceListItemComponent = withSkeletonTemplate<ResourceListItemConfig>(
  ({
    name,
    description,
    icon,
    rightContent,
    href,
    onClick,
    alignItems,
    showRightContent = false,
    invertNameDescription = false
  }) => {
    return (
      <ListItem
        icon={icon}
        alignItems={alignItems ?? (showRightContent ? 'top' : 'center')}
        data-testid='ResourceListItem'
        href={href}
        onClick={onClick}
      >
        <div
          className={`flex  ${invertNameDescription ? 'flex-col-reverse' : 'flex-col'}`}
        >
          <Text
            tag='div'
            weight='semibold'
            data-testid='ResourceListItem-number'
          >
            {name}
          </Text>
          <Text
            tag='div'
            weight='medium'
            size='small'
            variant='info'
            data-testid='ResourceListItem-content'
          >
            {description}
          </Text>
        </div>
        <div>
          {showRightContent
            ? rightContent
            : onClick != null && <StatusIcon name='caretRight' />}
        </div>
      </ListItem>
    )
  }
)

/**
 * This component generates a list item based on the requested resource data and type.
 */
export const ResourceListItem = withSkeletonTemplate<ResourceListItemProps>(
  ({ resource, isLoading, delayMs, href, onClick, ...rest }) => {
    const { user } = useTokenProvider()
    const listItemProps = useMemo(() => {
      switch (resource.type) {
        case 'customers':
          return customerToProps({ resource, user })
        case 'orders':
          return orderToProps({ resource, user })
        case 'returns':
          return returnToProps({ resource, user })
        case 'stock_transfers':
          return stockTransferToProps({ resource, user })
        case 'shipments':
          return shipmentToProps({ resource, user })
        case 'sku_list_items':
          return skuListItemToProps({ resource, user })
        case 'buy_x_pay_y_promotions':
        case 'external_promotions':
        case 'fixed_amount_promotions':
        case 'fixed_price_promotions':
        case 'free_gift_promotions':
        case 'free_shipping_promotions':
        case 'percentage_discount_promotions':
          return promotionToProps({ resource, user })
      }
    }, [resource])
    return (
      <ResourceListItemComponent
        {...listItemProps}
        href={href}
        onClick={onClick}
        {...rest}
      />
    )
  }
)
