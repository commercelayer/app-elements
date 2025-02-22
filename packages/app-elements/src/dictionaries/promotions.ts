import { getEventDateInfo } from '#helpers/date'
import type { Promotion } from '@commercelayer/sdk'
import { t } from 'i18next'
import type { DisplayStatus } from './types'

interface PromotionDisplayStatus extends DisplayStatus {
  status: 'disabled' | 'active' | 'upcoming' | 'expired' | 'used'
}

export function getPromotionDisplayStatus(
  promotion: Omit<Promotion, 'type' | 'promotion_rules'>
): PromotionDisplayStatus {
  if (promotion.disabled_at != null) {
    return {
      status: 'disabled',
      label: t('resources.promotions.attributes.status.disabled'),
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
      label: t('resources.promotions.attributes.status.expired'),
      icon: 'flag',
      color: 'gray'
    }
  }

  switch (eventDateInfo) {
    case 'past':
      return {
        status: 'expired',
        label: t('resources.promotions.attributes.status.expired'),
        icon: 'flag',
        color: 'gray'
      }

    case 'upcoming':
      return {
        status: 'upcoming',
        label: t('apps.promotions.display_status.upcoming'),
        icon: 'calendarBlank',
        color: 'gray'
      }

    case 'active':
      return {
        status: 'active',
        label: t('resources.promotions.attributes.status.active'),
        icon: 'pulse',
        color: 'green'
      }
  }
}
