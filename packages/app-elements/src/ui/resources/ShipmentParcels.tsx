import { Avatar } from '#ui/atoms/Avatar'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { CardDialog } from '#ui/composite/CardDialog'
import { ListDetailsItem } from '#ui/lists/ListDetailsItem'
import { ListItem } from '#ui/lists/ListItem'
import {
  getParcelTrackingDetail,
  hasSingleTracking,
  hasTracking
} from '#utils/tracking'
import {
  type Parcel as ParcelResource,
  type Shipment
} from '@commercelayer/sdk'
import { Package } from '@phosphor-icons/react'
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
  onRemove?: () => void
}>(({ parcel, onRemove }) => {
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
        <Tracking parcel={parcel} />
      </Spacer>
    </CardDialog>
  )
})

const Carrier = withSkeletonTemplate<{
  shipment: Shipment
}>(({ shipment }) => {
  const parcel = shipment.parcels?.[0]
  const trackingDetails = getParcelTrackingDetail(parcel)
  const singleTracking = hasSingleTracking(shipment)

  if (parcel == null || trackingDetails == null) {
    return null
  }

  return (
    <CardDialog
      /* TODO: how to get the title, subtitle and icon? */
      title='Express Easy'
      subtitle='DHL express'
      icon={
        <Avatar src='payments:adyen' alt='Adyen' shape='circle' size='small' />
      }
      rightContent={
        <Text size='regular' weight='bold'>
          {/* TODO: how to get the price? */}
          $29
        </Text>
      }
    >
      {singleTracking && (
        <Spacer top='4'>
          <Tracking parcel={parcel} />
        </Spacer>
      )}
    </CardDialog>
  )
})

const Tracking = withSkeletonTemplate<{
  parcel: ParcelResource
}>(({ parcel }) => {
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
      {parcel.tracking_number != null && (
        <ListDetailsItem
          label='Estimated delivery'
          childrenAlign='right'
          border='none'
          gutter='none'
        >
          {/* TODO: how to get the estimated delivery? */}
          May 17, 2023 · 12:00 AM
        </ListDetailsItem>
      )}
    </>
  )
})

ShipmentParcels.displayName = 'Parcel'
