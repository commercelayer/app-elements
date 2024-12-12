import { getEventDateInfo } from '#helpers/date'
import { useTranslation } from '#providers/I18NProvider'
import type { Promotion } from '@commercelayer/sdk'
import type { DisplayStatus } from './types'

interface PromotionDisplayStatus extends DisplayStatus {
  status: 'disabled' | 'active' | 'upcoming' | 'expired' | 'used'
}

export function getPromotionDisplayStatus(
  promotion: Omit<Promotion, 'type' | 'promotion_rules'>
): PromotionDisplayStatus {
  const { t } = useTranslation()
  if (promotion.disabled_at != null) {
    return {
      status: 'disabled',
      label: t('common.resources.promotions.status.disabled'),
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
      label: t('common.resources.promotions.status.expired'),
      icon: 'flag',
      color: 'gray'
    }
  }

  switch (eventDateInfo) {
    case 'past':
      return {
        status: 'expired',
        label: t('common.resources.promotions.status.expired'),
        icon: 'flag',
        color: 'gray'
      }

    case 'upcoming':
      return {
        status: 'upcoming',
        label: t('common.resources.promotions.status.upcoming'),
        icon: 'calendarBlank',
        color: 'gray'
      }

    case 'active':
      return {
        status: 'active',
        label: t('common.resources.promotions.status.active'),
        icon: 'pulse',
        color: 'green'
      }
  }
}
