import { getReturnDisplayStatus } from '#dictionaries/returns'
import { formatDate } from '#helpers/date'
import { type I18NLocale } from '#providers/I18NProvider'
import {
  ListItemDescription,
  ListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type { Return } from '@commercelayer/sdk'
import { type ResourceToProps } from '../types'

export const returnToProps: ResourceToProps<Return> = ({
  resource,
  user,
  t
}) => {
  const displayStatus = getReturnDisplayStatus(resource)
  const locale = (user?.locale.split('-')[0] as I18NLocale) ?? 'en'

  const returnStockLocationName =
    resource.stock_location?.name != null
      ? `${t('common.to')} ${resource.stock_location.name} `
      : ''
  const number = resource.number != null ? `#${resource.number}` : ''

  return {
    name: `${t('resources.returns.name')} ${number}`,
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={formatDate({
          format: 'full',
          isoDate: resource.updated_at,
          timezone: user?.timezone,
          locale
        })}
        additionalInfos={returnStockLocationName}
      />
    ),
    icon: <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
  }
}
