import { getEventDateInfo } from '#helpers/date'
import type { Promotion } from '@commercelayer/sdk'
import type { DisplayStatus } from './types'

interface PromotionDisplayStatus extends DisplayStatus {
  status: 'disabled' | 'active' | 'upcoming' | 'expired' | 'used'
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

  if (
    promotion.total_usage_limit != null &&
    promotion.total_usage_count === promotion.total_usage_limit
  ) {
    return {
      status: 'used',
      label: 'Expired',
      icon: 'flag',
      color: 'gray'
    }
  }

  switch (eventDateInfo) {
    case 'past':
      return {
        status: 'expired',
        label: 'Expired',
        icon: 'flag',
        color: 'gray'
      }

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
