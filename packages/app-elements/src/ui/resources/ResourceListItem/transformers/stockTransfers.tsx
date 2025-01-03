import { getStockTransferDisplayStatus } from '#dictionaries/stockTransfers'
import { formatDate } from '#helpers/date'
import {
  ListItemDescription,
  ListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type { StockTransfer } from '@commercelayer/sdk'
import { type ResourceToProps } from '../types'

export const stockTransferToProps: ResourceToProps<StockTransfer> = ({
  resource,
  user,
  t
}) => {
  const displayStatus = getStockTransferDisplayStatus(resource)
  const originStockLocationName =
    resource.origin_stock_location?.name != null
      ? `${t('common.from')} ${resource.origin_stock_location.name} `
      : ''
  const destinationStockLocationName =
    resource.destination_stock_location?.name != null
      ? `${t('common.to')} ${resource.destination_stock_location.name} `
      : ''
  const number = resource.number != null ? `#${resource.number}` : ''

  return {
    name: `${t('resources.stock_transfers.name')} ${number}`,
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={formatDate({
          format: 'full',
          isoDate: resource.updated_at,
          timezone: user?.timezone
        })}
        additionalInfos={`${originStockLocationName} · ${destinationStockLocationName}`}
      />
    ),
    icon: <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
  }
}
