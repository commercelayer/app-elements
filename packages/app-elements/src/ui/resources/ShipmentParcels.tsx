import { Avatar } from '#ui/atoms/Avatar'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { CardDialog } from '#ui/composite/CardDialog'
import { ListDetailsItem } from '#ui/lists/ListDetailsItem'
import { ListItem } from '#ui/lists/ListItem'
import {
  getParcelTrackingDetail,
  getShipmentRate,
  hasSingleTracking,
  hasTracking
} from '#utils/tracking'
import {
  type Parcel as ParcelResource,
  type Shipment
} from '@commercelayer/sdk'
import { Package } from '@phosphor-icons/react'
import cn from 'classnames'
import { type SetNonNullable, type SetRequired } from 'type-fest'

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
  shipment: Shipment
  onRemove?: (parcelId: string) => void
}>(({ shipment, onRemove }) => {
  const singleTracking = hasSingleTracking(shipment)
  const rate = getShipmentRate(shipment)
  return (
    <>
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
                    tracking_status_updated_at: undefined
                  }
                : parcel
            }
            onRemove={
              hasTracking(shipment)
                ? undefined
                : () => {
                    onRemove?.(parcel.id)
                  }
            }
          />
        )
      })}
    </>
  )
})

const Parcel = withSkeletonTemplate<{
  parcel: SetNonNullableRequired<ParcelResource, 'package'>
  estimatedDelivery?: string
  onRemove?: () => void
}>(({ parcel, estimatedDelivery, onRemove }) => {
  return (
    <CardDialog
      onClose={onRemove}
      title={parcel.package.name}
      icon={<Package size={42} className='text-gray-300' weight='thin' />}
    >
      {parcel.parcel_line_items?.map((parcelLineItem, index) => (
        <div key={parcelLineItem.id}>
          <ListItem
            tag='div'
            alignItems='top'
            borderStyle={
              parcel.parcel_line_items != null &&
              parcel.parcel_line_items.length - 1 === index
                ? 'solid'
                : 'dashed'
            }
            gutter='none'
            icon={
              <Avatar
                size='small'
                alt={parcelLineItem.name}
                src={parcelLineItem.image_url as `https://${string}`}
              />
            }
          >
            <div>
              <Text size='small' tag='div' variant='info' weight='medium'>
                {parcelLineItem.sku_code}
              </Text>
              <Text tag='div' weight='bold'>
                {parcelLineItem.name}
              </Text>
            </div>
            <div>
              <Text size='small' tag='div' variant='info' weight='medium'>
                &nbsp;
              </Text>
              <Text tag='div' variant='info' wrap='nowrap'>
                x {parcelLineItem.quantity}
              </Text>
            </div>
          </ListItem>
        </div>
      ))}
      <Spacer top='4'>
        <ListDetailsItem
          label='Total'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          {parcel.parcel_line_items?.reduce(
            (sum, item) => sum + item.quantity,
            0
          )}{' '}
          items
        </ListDetailsItem>
        <ListDetailsItem
          label='Weight'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          {parcel.weight} {parcel.unit_of_weight}
        </ListDetailsItem>
        <Tracking parcel={parcel} estimatedDelivery={estimatedDelivery} />
      </Spacer>
    </CardDialog>
  )
})

const Carrier = withSkeletonTemplate<{
  shipment: Shipment
}>(({ shipment }) => {
  const parcel = shipment.parcels?.[0]
  const rate = getShipmentRate(shipment)
  const singleTracking = hasSingleTracking(shipment)

  if (parcel == null || rate == null) {
    return null
  }

  return (
    <CardDialog
      title={rate.service}
      subtitle={rate.carrier}
      icon={
        // TODO: add carrier icons
        <Avatar
          className={cn({
            'mt-0.5': !singleTracking
          })}
          src='payments:adyen'
          alt='Adyen'
          shape='circle'
          size='small'
        />
      }
      rightContent={
        <Text size='regular' weight='bold'>
          {rate.formatted_rate}
        </Text>
      }
    >
      {singleTracking && (
        <Spacer top='4'>
          <Tracking
            parcel={parcel}
            estimatedDelivery={rate.formatted_delivery_date}
          />
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
        <ListDetailsItem
          label='Status'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          {trackingDetails.status}
        </ListDetailsItem>
      )}
      {parcel.tracking_number != null && (
        <ListDetailsItem
          label='Tracking'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          {parcel.tracking_number}
        </ListDetailsItem>
      )}
      {estimatedDelivery != null && (
        <ListDetailsItem
          label='Estimated delivery'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          {/* TODO: how to get the estimated delivery? */}
          {estimatedDelivery}
        </ListDetailsItem>
      )}
    </>
  )
})

ShipmentParcels.displayName = 'Parcel'
