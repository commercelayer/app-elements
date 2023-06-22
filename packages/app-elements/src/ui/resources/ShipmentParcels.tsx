import { A } from '#ui/atoms/A'
import { Avatar, type AvatarProps } from '#ui/atoms/Avatar'
import { Icon } from '#ui/atoms/Icon'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { CardDialog } from '#ui/composite/CardDialog'
import { ListDetailsItem } from '#ui/lists/ListDetailsItem'
import { ListItem, type ListItemProps } from '#ui/lists/ListItem'
import {
  getParcelTrackingDetail,
  getShipmentRate,
  hasSingleTracking,
  hasTracking
} from '#utils/tracking'
import {
  type ParcelLineItem as ParcelLineItemResource,
  type Parcel as ParcelResource,
  type Shipment as ShipmentResource
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
  shipment: ShipmentResource
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
                    tracking_status_updated_at: undefined,
                    shipping_label_file_type: undefined,
                    shipping_label_resolution: undefined,
                    shipping_label_size: undefined,
                    shipping_label_url: undefined
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

ShipmentParcels.displayName = 'ShipmentParcels'

const ParcelLineItem = withSkeletonTemplate<{
  parcelLineItem: ParcelLineItemResource
  borderStyle: ListItemProps['borderStyle']
}>(({ parcelLineItem, borderStyle }) => {
  return (
    <ListItem
      tag='div'
      alignItems='top'
      borderStyle={borderStyle}
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
        <Text className='text-xs' tag='div' variant='info' weight='medium'>
          {parcelLineItem.sku_code}
        </Text>
        <Text size='small' tag='div' weight='bold'>
          {parcelLineItem.name}
        </Text>
      </div>
      <div>
        <Text className='text-xs' tag='div' variant='info' weight='medium'>
          &nbsp;
        </Text>
        <Text size='small' tag='div' variant='info' wrap='nowrap'>
          x {parcelLineItem.quantity}
        </Text>
      </div>
    </ListItem>
  )
})

const Parcel = withSkeletonTemplate<{
  parcel: SetNonNullableRequired<ParcelResource, 'package'>
  estimatedDelivery?: string
  onRemove?: () => void
}>(({ parcel, estimatedDelivery, onRemove }) => {
  const itemsLength =
    parcel.parcel_line_items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <CardDialog
      onClose={onRemove}
      title={parcel.package.name}
      icon={<Package size={42} className='text-gray-300' weight='thin' />}
      footer={
        parcel.shipping_label_url == null ? undefined : (
          <PrintLabel href={parcel.shipping_label_url} />
        )
      }
    >
      {parcel.parcel_line_items?.map((parcelLineItem, index) => (
        <ParcelLineItem
          key={parcelLineItem.id}
          parcelLineItem={parcelLineItem}
          borderStyle={
            parcel.parcel_line_items != null &&
            parcel.parcel_line_items.length - 1 === index
              ? 'solid'
              : 'dashed'
          }
        />
      ))}
      <Spacer top='4'>
        <Text size='small'>
          <ListDetailsItem
            label='Total'
            childrenAlign='right'
            border='none'
            gutter='none'
          >
            {itemsLength} {itemsLength > 1 ? 'items' : 'item'}
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
        </Text>
      </Spacer>
    </CardDialog>
  )
})

function getAvatarSrc(carrier: string | null | undefined): AvatarProps['src'] {
  switch (carrier) {
    case 'DHLEcommerceAsia':
    case 'DhlEcs':
    case 'DHLExpress':
    case 'DHLPaket':
    case 'DHLSmartmail':
      return 'carriers:dhl'
    case 'FedEx':
    case 'FedExCrossBorder':
    case 'FedExMailview':
    case 'FedexSmartPost':
      return 'carriers:fedex'
    default:
      return 'carriers:generic'
  }
}

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
      title={rate.service}
      subtitle={rate.carrier}
      icon={
        <Avatar
          className={cn({
            'mt-0.5': !singleTracking
          })}
          src={getAvatarSrc(rate.carrier)}
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
      footer={
        singleTracking && parcel.shipping_label_url != null ? (
          <PrintLabel href={parcel.shipping_label_url} />
        ) : undefined
      }
    >
      {singleTracking && (
        <Spacer top='4'>
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
          {estimatedDelivery}
        </ListDetailsItem>
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
