import type { TokenProviderAuthUser } from '#providers/TokenProvider/types'
import type { Customer, Order, Return } from '@commercelayer/sdk'

export type ResourceListItemType = Order | Return | Customer

export interface ResourceListItemComponentProps {
  name: string
  description: JSX.Element | string
  icon: JSX.Element
  rightContent?: JSX.Element
  showArrow?: boolean
}

export type ResourceToProps<Resource> = (options: {
  resource: Resource
  user: TokenProviderAuthUser | null
}) => ResourceListItemComponentProps
