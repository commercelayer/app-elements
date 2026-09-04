import type {
  BuyXPayYPromotion,
  Customer,
  ExternalPromotion,
  FixedAmountPromotion,
  FixedPricePromotion,
  FlexPromotion,
  FreeGiftPromotion,
  FreeShippingPromotion,
  Order,
  PercentageDiscountPromotion,
  Return,
  Shipment,
  SkuListItem,
  StockTransfer,
} from "@commercelayer/sdk"
import type { t } from "i18next"
import type { JSX } from "react"
import type { DisplayStatus } from "#dictionaries/types"
import type { TokenProviderAuthUser } from "#providers/TokenProvider/types"
import type { ListItemProps } from "#ui/composite/ListItem"

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
  | FlexPromotion

export interface ResourceListItemComponentProps {
  name: React.ReactNode
  description: JSX.Element | string
  /**
   * The status icon on the left. Left out where the row says where the resource
   * stands some other way — an order shows it as a `status` badge instead.
   */
  icon?: JSX.Element
  rightContent?: JSX.Element
  bottomContent?: JSX.Element
  invertNameDescription?: boolean
  alignItems?: ListItemProps["alignItems"]
  /**
   * Where the resource stands, shown as a badge beside the name. A resource sets
   * either this or an `icon`, not both: two renderings of one fact read as two
   * facts. Keep it out of the description too, for the same reason.
   */
  status?: DisplayStatus
}

export type ResourceToProps<Resource> = (options: {
  resource: Resource
  user: TokenProviderAuthUser | null
  t: typeof t
}) => ResourceListItemComponentProps
