import type { TokenProviderAuthUser } from '#providers/TokenProvider/types'
import { type ListItemProps } from '#ui/composite/ListItem'
import type {
  BuyXPayYPromotion,
  Customer,
  ExternalPromotion,
  FixedAmountPromotion,
  FixedPricePromotion,
  FreeGiftPromotion,
  FreeShippingPromotion,
  Order,
  PercentageDiscountPromotion,
  Return,
  Shipment,
  SkuListItem,
  StockTransfer
} from '@commercelayer/sdk'

export type ResourceListItemType =
  | Order
  | Return
  | Customer
  | StockTransfer
  | SkuListItem
  | Shipment
  | BuyXPayYPromotion
  | ExternalPromotion
  | FixedAmountPromotion
  | FixedPricePromotion
  | FreeGiftPromotion
  | FreeShippingPromotion
  | PercentageDiscountPromotion

export interface ResourceListItemComponentProps {
  name: React.ReactNode
  description: JSX.Element | string
  icon: JSX.Element
  rightContent?: JSX.Element
  invertNameDescription?: boolean
  alignItems?: ListItemProps['alignItems']
}

export type ResourceToProps<Resource> = (options: {
  resource: Resource
  user: TokenProviderAuthUser | null
}) => ResourceListItemComponentProps
