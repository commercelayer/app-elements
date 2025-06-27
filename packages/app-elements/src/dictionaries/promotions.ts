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
  const labelSuffix = [
    promotion.exclusive === true
      ? t('resources.promotions.attributes.exclusive')
      : undefined,
    promotion.priority != null
      ? `${t('resources.promotions.attributes.priority')}: ${promotion.priority}`
      : undefined
  ].filter((v): v is string => v != null)

  const labelSuffixText =
    labelSuffix.length > 0 ? ` · ${labelSuffix.join(' · ')}` : ''

  if (promotion.disabled_at != null) {
    return {
      status: 'disabled',
      label: `${t('resources.promotions.attributes.status.disabled')}${labelSuffixText}`,
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
      label: `${t('resources.promotions.attributes.status.expired')}${labelSuffixText}`,
      icon: 'flag',
      color: 'gray'
    }
  }

  switch (eventDateInfo) {
    case 'past':
      return {
        status: 'expired',
        label: `${t('resources.promotions.attributes.status.expired')}${labelSuffixText}`,
        icon: 'flag',
        color: 'gray'
      }

    case 'upcoming':
      return {
        status: 'upcoming',
        label: `${t('apps.promotions.display_status.upcoming')}${labelSuffixText}`,
        icon: 'calendarBlank',
        color: 'gray'
      }

    case 'active':
      return {
        status: 'active',
        label: `${t('resources.promotions.attributes.status.active')}${labelSuffixText}`,
        icon: 'pulse',
        color: 'green'
      }
  }
}
