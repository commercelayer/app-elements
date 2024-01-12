import type { TokenProviderAuthUser } from '#providers/TokenProvider/types'
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
  StockTransfer
} from '@commercelayer/sdk'

export type ResourceListItemType =
  | Order
  | Return
  | Customer
  | StockTransfer
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
}

export type ResourceToProps<Resource> = (options: {
  resource: Resource
  user: TokenProviderAuthUser | null
}) => ResourceListItemComponentProps
