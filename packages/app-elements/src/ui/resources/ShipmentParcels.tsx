import {
  getAvatarSrcFromRate,
  getParcelTrackingDetail,
  getShipmentRate,
  hasBeenPurchased,
  hasSingleTracking
} from '#helpers/tracking'
import { A } from '#ui/atoms/A'
import { Avatar } from '#ui/atoms/Avatar'
import { Icon } from '#ui/atoms/Icon'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { CardDialog } from '#ui/composite/CardDialog'
import { FlexRow } from '#ui/internals/FlexRow'
import {
  type Parcel as ParcelResource,
  type Shipment as ShipmentResource
} from '@commercelayer/sdk'
import { Package } from '@phosphor-icons/react'
import cn from 'classnames'
import { type SetNonNullable, type SetRequired } from 'type-fest'
import { LineItems } from './LineItems'

type SetNonNullableRequired<
  BaseType,
  Keys extends keyof BaseType
> = SetRequired<SetNonNullable<BaseType, Keys>, Keys>

function hasPackage(
  parcel: ParcelResource
): parcel is SetNonNullableRequired<ParcelResource, 'package'> {
  return parcel.package != null
}

export const ShipmentParcels = withSkeletonTemplate<{
  shipment: ShipmentResource
  onRemoveParcel?: (parcelId: string) => void
}>(({ shipment, onRemoveParcel }) => {
  const singleTracking = hasSingleTracking(shipment)
  const rate = getShipmentRate(shipment)
  return (
    <div
      data-test-id={`shipment-parcels-${shipment.id}`}
      className='flex flex-col gap-2'
    >
      <Carrier shipment={shipment} />
      {shipment.parcels?.map((parcel) => {
        if (!hasPackage(parcel)) {
          return null
        }

        return (
          <Parcel
            key={parcel.id}
            estimatedDelivery={
              singleTracking ? undefined : rate?.formatted_delivery_date
            }
            parcel={
              singleTracking
                ? {
                    ...parcel,
                    tracking_details: undefined,
                    tracking_number: undefined,
                    tracking_status: undefined,
                    tracking_status_detail: undefined,
                    tracking_status_updated_at: undefined,
                    shipping_label_file_type: undefined,
                    shipping_label_resolution: undefined,
                    shipping_label_size: undefined,
                    shipping_label_url: undefined
                  }
                : parcel
            }
            onRemove={
              hasBeenPurchased(shipment) || shipment.status !== 'packing'
                ? undefined
                : () => {
                    onRemoveParcel?.(parcel.id)
                  }
            }
          />
        )
      })}
    </div>
  )
})

ShipmentParcels.displayName = 'ShipmentParcels'

const Parcel = withSkeletonTemplate<{
  parcel: SetNonNullableRequired<ParcelResource, 'package'>
  estimatedDelivery?: string
  onRemove?: () => void
}>(({ parcel, estimatedDelivery, onRemove }) => {
  const itemsLength =
    parcel.parcel_line_items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <CardDialog
      data-test-id={`parcel-box-${parcel.id}`}
      onClose={onRemove}
      title={parcel.package.name}
      icon={<Package size={42} className='text-gray-300' weight='thin' />}
      footer={
        parcel.shipping_label_url == null ? undefined : (
          <PrintLabel href={parcel.shipping_label_url} />
        )
      }
    >
      {parcel.parcel_line_items != null && (
        <LineItems items={parcel.parcel_line_items} size='small' />
      )}
      <Spacer top='6'>
        <Text size='small'>
          <FlexRow>
            <Text variant='info'>Total</Text>
            <Text weight='semibold'>
              {itemsLength} {itemsLength > 1 ? 'items' : 'item'}
            </Text>
          </FlexRow>
          <Spacer top='4'>
            <FlexRow>
              <Text variant='info'>Weight</Text>
              <Text weight='semibold'>
                {parcel.weight} {parcel.unit_of_weight}
              </Text>
            </FlexRow>
          </Spacer>
          <Tracking parcel={parcel} estimatedDelivery={estimatedDelivery} />
        </Text>
      </Spacer>
    </CardDialog>
  )
})

const Carrier = withSkeletonTemplate<{
  shipment: ShipmentResource
}>(({ shipment }) => {
  const parcel = shipment.parcels?.[0]
  const rate = getShipmentRate(shipment)
  const singleTracking = hasSingleTracking(shipment)

  if (parcel == null || rate == null) {
    return null
  }

  return (
    <CardDialog
      data-test-id={`carrier-box-${shipment.id}`}
      title={rate.service}
      subtitle={rate.carrier}
      icon={
        <Avatar
          className={cn({
            'mt-0.5': !singleTracking
          })}
          src={getAvatarSrcFromRate(rate)}
          alt='Adyen'
          border='none'
          shape='circle'
          size='small'
        />
      }
      rightContent={
        <Text size='regular' weight='bold'>
          {rate.formatted_rate}
        </Text>
      }
      footer={
        singleTracking && parcel.shipping_label_url != null ? (
          <PrintLabel href={parcel.shipping_label_url} />
        ) : undefined
      }
    >
      {singleTracking && (
        <Spacer top='6'>
          <Text size='small'>
            <Tracking
              parcel={parcel}
              estimatedDelivery={rate.formatted_delivery_date}
            />
          </Text>
        </Spacer>
      )}
    </CardDialog>
  )
})

const Tracking = withSkeletonTemplate<{
  parcel: ParcelResource
  estimatedDelivery?: string
}>(({ parcel, estimatedDelivery }) => {
  const trackingDetails = getParcelTrackingDetail(parcel)
  return (
    <>
      {trackingDetails?.status != null && (
        <FlexRow className='mt-4'>
          <Text variant='info'>Status</Text>
          <Text weight='semibold'>{trackingDetails.status}</Text>
        </FlexRow>
      )}
      {parcel.tracking_number != null && (
        <FlexRow className='mt-4'>
          <Text variant='info'>Tracking</Text>
          <Text weight='semibold'>{parcel.tracking_number}</Text>
        </FlexRow>
      )}
      {estimatedDelivery != null && (
        <FlexRow className='mt-4'>
          <Text variant='info'>Estimated delivery</Text>
          <Text weight='semibold'>{estimatedDelivery}</Text>
        </FlexRow>
      )}
    </>
  )
})

const PrintLabel = withSkeletonTemplate<{ href: string }>(({ href }) => {
  return (
    <div className='text-center'>
      <A href={href}>
        <Icon gap='small' className='text-2xl mr-1' name='printer' />{' '}
        <Text size='small'>Print label</Text>
      </A>
    </div>
  )
})
