import { Icon } from '#ui/atoms/Icon'

import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'

import { useMemo } from 'react'

import {
  customerToProps,
  orderToProps,
  returnToProps
} from '#ui/resources/ResourceListItem/transformers'

import { useTokenProvider } from '#providers/TokenProvider'

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
   * HTML tag to render
   */
  tag?: 'a' | 'div'
  /**
   * Optional onClick function
   */
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>
  ) => void
}

type ResourceListItemConfig = Pick<ResourceListItemProps, 'tag' | 'onClick'> &
  ResourceListItemComponentProps

const ResourceListItemComponent = withSkeletonTemplate<ResourceListItemConfig>(
  ({
    name,
    description,
    icon,
    rightContent,
    showArrow = false,
    tag = 'div',
    onClick
  }) => {
    const showRightContent = rightContent != null && !showArrow

    return (
      <ListItem
        tag={tag}
        icon={icon}
        alignItems={showRightContent ? 'top' : 'center'}
        data-test-id='ResourceListItem'
        onClick={onClick}
      >
        <div>
          <Text
            tag='div'
            weight='semibold'
            data-test-id='ResourceListItem-number'
          >
            {name}
          </Text>
          <Text
            tag='div'
            weight='medium'
            size='small'
            variant='info'
            data-test-id='ResourceListItem-content'
          >
            {description}
          </Text>
        </div>
        <div>
          {showRightContent ? rightContent : <Icon name='caretRight' />}
        </div>
      </ListItem>
    )
  }
)

/**
 * This component generates a list item based on the requested resource data and type.
 */
export const ResourceListItem = withSkeletonTemplate<ResourceListItemProps>(
  ({ resource, tag = 'div', isLoading, delayMs, onClick, ...rest }) => {
    const { user } = useTokenProvider()
    const listItemProps = useMemo(() => {
      switch (resource.type) {
        case 'customers':
          return customerToProps({ resource, user })
        case 'orders':
          return orderToProps({ resource, user })
        case 'returns':
          return returnToProps({ resource, user })
      }
    }, [resource])
    return (
      <ResourceListItemComponent
        {...listItemProps}
        tag={tag}
        onClick={onClick}
        {...rest}
      />
    )
  }
)
