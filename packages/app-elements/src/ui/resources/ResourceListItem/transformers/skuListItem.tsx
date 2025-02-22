import { Avatar } from '#ui/atoms/Avatar'
import { Text } from '#ui/atoms/Text'
import type { SkuListItem } from '@commercelayer/sdk'
import { type ResourceToProps } from '../types'

export const skuListItemToProps: ResourceToProps<SkuListItem> = ({
  resource,
  user
}) => {
  return {
    name: resource.sku?.name ?? '',
    description: resource.sku?.code ?? '',
    icon: (
      <Avatar
        alt={resource.sku?.name ?? ''}
        src={resource.sku?.image_url as `https://${string}`}
      />
    ),
    invertNameDescription: true,
    rightContent: (
      <Text weight='semibold' wrap='nowrap'>
        x {resource.quantity}
      </Text>
    ),
    showRightContent: true,
    alignItems: 'bottom'
  }
}
