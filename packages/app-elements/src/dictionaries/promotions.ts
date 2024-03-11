import { getEventDateInfo } from '#helpers/date'
import type { Promotion } from '@commercelayer/sdk'
import type { DisplayStatus } from './types'

interface PromotionDisplayStatus extends DisplayStatus {
  status: 'disabled' | 'active' | 'upcoming' | 'expired'
}

export function getPromotionDisplayStatus(
  promotion: Omit<Promotion, 'type'>
): PromotionDisplayStatus {
  if (promotion.disabled_at != null) {
    return {
      status: 'disabled',
      label: 'Disabled',
      icon: 'minus',
      color: 'lightGray'
    }
  }

  const eventDateInfo = getEventDateInfo({
    startsAt: promotion.starts_at,
    expiresAt: promotion.expires_at
  })

  const expiredStatus: PromotionDisplayStatus = {
    status: 'expired',
    label: 'Expired',
    icon: 'flag',
    color: 'gray'
  }

  if (
    promotion.total_usage_limit != null &&
    promotion.total_usage_count === promotion.total_usage_limit
  ) {
    return expiredStatus
  }

  switch (eventDateInfo) {
    case 'past':
      return expiredStatus

    case 'upcoming':
      return {
        status: 'upcoming',
        label: 'Upcoming',
        icon: 'calendarBlank',
        color: 'gray'
      }

    case 'active':
      return {
        status: 'active',
        label: 'Active',
        icon: 'pulse',
        color: 'green'
      }
  }
}
