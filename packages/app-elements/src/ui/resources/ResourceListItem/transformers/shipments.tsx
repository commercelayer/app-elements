import { getShipmentDisplayStatus } from '#dictionaries/shipments'
import { formatDate } from '#helpers/date'
import { RadialProgress } from '#ui/atoms/RadialProgress'
import {
  ListItemDescription,
  ListItemIcon
} from '#ui/resources/ResourceListItem/common'
import type { Shipment } from '@commercelayer/sdk'
import { type ResourceToProps } from '../types'

export const shipmentToProps: ResourceToProps<Shipment> = ({
  resource,
  user
}) => {
  const stockTransfersToBeAwaited =
    resource.stock_transfers?.filter(
      (stockTransfer) =>
        stockTransfer.status !== 'completed' &&
        stockTransfer.status !== 'cancelled' &&
        stockTransfer.status !== 'draft'
    ) ?? []

  const awaitingStockTransfer = stockTransfersToBeAwaited.length > 0
  const displayStatus = getShipmentDisplayStatus(
    resource,
    awaitingStockTransfer
  )
  const returnStockLocationName =
    resource.stock_location?.name != null
      ? `From ${resource.stock_location.name} `
      : ''
  const number = resource.number != null ? `#${resource.number}` : ''

  return {
    name: `Shipment ${number}`,
    description: (
      <ListItemDescription
        displayStatus={displayStatus}
        date={formatDate({
          format: 'full',
          isoDate: resource.updated_at,
          timezone: user?.timezone
        })}
        additionalInfos={returnStockLocationName}
      />
    ),
    icon:
      !awaitingStockTransfer && resource.status === 'upcoming' ? (
        <RadialProgress icon='truck' />
      ) : (
        <ListItemIcon icon={displayStatus.icon} color={displayStatus.color} />
      )
  }
}
