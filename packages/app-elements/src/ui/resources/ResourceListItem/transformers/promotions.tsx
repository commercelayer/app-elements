import { getPromotionDisplayStatus } from '#dictionaries/promotions'
import { formatDateRange } from '#helpers/date'
import { Badge } from '#ui/atoms/Badge'
import { RadialProgress } from '#ui/atoms/RadialProgress'
import {
  ListItemDescription,
  ListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type {
  BuyXPayYPromotion,
  ExternalPromotion,
  FixedAmountPromotion,
  FixedPricePromotion,
  FlexPromotion,
  FreeGiftPromotion,
  FreeShippingPromotion,
  PercentageDiscountPromotion
} from '@commercelayer/sdk'
import { type ResourceToProps } from '../types'

// TODO: this is a temporary fix. We should manage this kind of type directly into the SDK.
type Promotion =
  | BuyXPayYPromotion
  | ExternalPromotion
  | FixedAmountPromotion
  | FixedPricePromotion
  | FlexPromotion
  | FreeGiftPromotion
  | FreeShippingPromotion
  | PercentageDiscountPromotion

export const promotionToProps: ResourceToProps<Promotion> = ({
  resource,
  user
}) => {
  const displayStatus = getPromotionDisplayStatus(resource)
  const hasCoupons = resource.coupon_codes_promotion_rule != null

  return {
    name: (
      <>
        {resource.name}{' '}
        {resource.type === 'flex_promotions' && (
          <Badge className='ml-1' variant='teal'>
            flex
          </Badge>
        )}{' '}
        {hasCoupons && (
          <Badge className='ml-1' variant='teal'>
            coupons
          </Badge>
        )}
      </>
    ),
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={formatDateRange({
          rangeFrom: resource.starts_at,
          rangeTo: resource.expires_at,
          timezone: user?.timezone
        })}
      />
    ),
    icon:
      displayStatus.status === 'upcoming' ? (
        <RadialProgress icon='calendarBlank' />
      ) : (
        <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
      )
  }
}
