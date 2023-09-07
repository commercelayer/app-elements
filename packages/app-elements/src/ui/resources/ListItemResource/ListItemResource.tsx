import { Icon } from '#ui/atoms/Icon'

import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/lists/ListItem'

import { useMemo } from 'react'

import {
  orderToProps,
  returnToProps
} from '#ui/resources/ListItemResource/transformers'

import type { Order, Return } from '@commercelayer/sdk'

type ListItemEnabledResource = Order | Return

interface ListItemResourceProps {
  resource: ListItemEnabledResource
  tag?: 'a' | 'div'
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>
  ) => void
}

export interface ListItemResourceComponentProps {
  name: string
  description: JSX.Element | string
  icon: JSX.Element
  rightContent?: JSX.Element
  showArrow?: boolean
}
type ListItemResourceConfig = Pick<ListItemResourceProps, 'tag' | 'onClick'> &
  ListItemResourceComponentProps

const ListItemResourceComponent: React.FC<ListItemResourceConfig> = ({
  name,
  description,
  icon,
  rightContent,
  showArrow = false,
  tag = 'div',
  onClick,
  ...rest
}) => {
  return (
    <ListItem
      tag={tag}
      icon={icon}
      alignItems='top'
      data-test-id='ListItemResource'
      onClick={onClick}
      {...rest}
    >
      <div>
        <Text
          tag='div'
          weight='semibold'
          data-test-id='ListItemResource-number'
        >
          {name}
        </Text>
        <Text
          tag='div'
          weight='medium'
          size='small'
          variant='info'
          data-test-id='ListItemResource-content'
        >
          {description}
        </Text>
      </div>
      <div>
        {rightContent != null && !showArrow ? (
          rightContent
        ) : (
          <Icon name='caretRight' />
        )}
      </div>
    </ListItem>
  )
}

export const ListItemResource = withSkeletonTemplate<ListItemResourceProps>(
  ({ resource, tag = 'div', isLoading, delayMs, onClick, ...rest }) => {
    const listItemProps = useMemo(() => {
      switch (resource.type) {
        case 'orders':
          return orderToProps(resource)
        case 'returns':
          return returnToProps(resource)
      }
    }, [resource])
    return (
      <ListItemResourceComponent
        {...listItemProps}
        tag={tag}
        onClick={onClick}
        {...rest}
      />
    )
  }
)
