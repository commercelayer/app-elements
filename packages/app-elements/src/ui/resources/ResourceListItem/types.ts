import type { TokenProviderAuthUser } from '#providers/TokenProvider/types'
import type {
  Customer,
  Order,
  Return,
  Shipment,
  StockTransfer
} from '@commercelayer/sdk'

export type ResourceListItemType =
  | Order
  | Return
  | Customer
  | StockTransfer
  | Shipment

export interface ResourceListItemComponentProps {
  name: string
  description: JSX.Element | string
  icon: JSX.Element
  rightContent?: JSX.Element
}

export type ResourceToProps<Resource> = (options: {
  resource: Resource
  user: TokenProviderAuthUser | null
}) => ResourceListItemComponentProps
