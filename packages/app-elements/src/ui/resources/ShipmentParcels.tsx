import { formatDate, sortAndGroupByDate } from '#helpers/date'
import {
  getAvatarSrcFromRate,
  getParcelTrackingDetail,
  getParcelTrackingDetails,
  getShipmentRate,
  hasBeenPurchased,
  hasSingleTracking,
  type Rate,
  type TrackingDetail
} from '#helpers/tracking'
import { useOverlayNavigation } from '#hooks/useOverlayNavigation'
import { useTokenProvider } from '#providers/TokenProvider'
import { A } from '#ui/atoms/A'
import { Avatar } from '#ui/atoms/Avatar'
import { Badge } from '#ui/atoms/Badge'
import { Icon } from '#ui/atoms/Icon'
import { Legend } from '#ui/atoms/Legend'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Stack } from '#ui/atoms/Stack'
import { Steps } from '#ui/atoms/Steps'
import { Text } from '#ui/atoms/Text'
import { CardDialog } from '#ui/composite/CardDialog'
import { PageLayout } from '#ui/composite/PageLayout'
import { FlexRow } from '#ui/internals/FlexRow'
import {
  type Parcel as ParcelResource,
  type Shipment as ShipmentResource
} from '@commercelayer/sdk'
import { Package } from '@phosphor-icons/react'
import cn from 'classnames'
import { useCallback, useMemo } from 'react'
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
            rate={rate}
            showEstimatedDelivery={!singleTracking}
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
  rate?: Rate
  showEstimatedDelivery?: boolean
  onRemove?: () => void
}>(({ parcel, rate, showEstimatedDelivery = false, onRemove }) => {
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
          <Tracking
            parcel={parcel}
            rate={rate}
            showEstimatedDelivery={showEstimatedDelivery}
          />
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
            <Tracking parcel={parcel} rate={rate} showEstimatedDelivery />
          </Text>
        </Spacer>
      )}
    </CardDialog>
  )
})

const Tracking = withSkeletonTemplate<{
  parcel: ParcelResource
  rate?: Rate
  showEstimatedDelivery: boolean
}>(({ parcel, rate, showEstimatedDelivery = false }) => {
  const trackingDetails = getParcelTrackingDetail(parcel)
  const { TrackingDetailsOverlay, openTrackingDetails } = useTrackingDetails(
    parcel,
    rate
  )

  return (
    <>
      <TrackingDetailsOverlay />
      {trackingDetails?.status != null && (
        <FlexRow className='mt-4'>
          <Text variant='info'>Status</Text>
          <Text weight='semibold'>{trackingDetails.status}</Text>
        </FlexRow>
      )}
      {parcel.tracking_number != null && (
        <FlexRow className='mt-4'>
          <Text variant='info'>Tracking</Text>
          <Text weight='semibold'>
            <A
              onClick={() => {
                openTrackingDetails()
              }}
            >
              {parcel.tracking_number}
            </A>
          </Text>
        </FlexRow>
      )}
      {showEstimatedDelivery && rate != null && (
        <FlexRow className='mt-4'>
          <Text variant='info'>Estimated delivery</Text>
          <Text weight='semibold'>{rate.formatted_delivery_date}</Text>
        </FlexRow>
      )}
    </>
  )
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useTrackingDetails = (parcel: ParcelResource, rate?: Rate) => {
  const {
    Overlay,
    open: openTrackingDetails,
    close
  } = useOverlayNavigation({
    queryParam: `tracking-${parcel.tracking_number ?? ''}`
  })

  const TrackingDetailsOverlay = useCallback(() => {
    return (
      parcel.tracking_number != null && (
        <Overlay>
          <PageLayout
            title={`Tracking #${parcel.tracking_number}`}
            onGoBack={() => {
              close()
            }}
          >
            <TrackingDetails parcel={parcel} rate={rate} />
          </PageLayout>
        </Overlay>
      )
    )
  }, [Overlay, close, parcel])

  return { TrackingDetailsOverlay, openTrackingDetails }
}

const TrackingDetails = withSkeletonTemplate<{
  parcel: ParcelResource
  rate?: Rate
}>(({ parcel, rate }) => {
  const { user } = useTokenProvider()

  interface Event {
    date: string
    tracking: TrackingDetail
  }

  const groupedEvents = useMemo(() => {
    const events: Event[] = getParcelTrackingDetails(parcel)
      .filter(
        (
          tracking
        ): tracking is SetNonNullableRequired<
          typeof tracking,
          'datetime' | 'message'
        > => tracking.datetime != null && tracking.message != null
      )
      .map((tracking) => ({
        date: tracking.datetime,
        tracking
      }))

    return sortAndGroupByDate(events)
  }, [parcel])

  const lastEvent = Object.values(groupedEvents)[0]?.[0] as Event | undefined

  return (
    <>
      <Steps
        steps={[
          {
            label: 'Pre-Transit',
            active: lastEvent?.tracking.status === 'pre_transit'
          },
          {
            label: 'In Transit',
            active: lastEvent?.tracking.status === 'in_transit'
          },
          {
            label: 'Out for delivery',
            active: lastEvent?.tracking.status === 'out_for_delivery'
          },
          {
            label: 'Delivered',
            active: lastEvent?.tracking.status === 'delivered'
          }
        ]}
      />
      <Spacer top='12' bottom='14'>
        <Stack>
          <div>
            <Spacer bottom='2'>
              <Text size='small' tag='div' variant='info' weight='semibold'>
                Courier
              </Text>
            </Spacer>
            {rate != null && (
              <Avatar
                src={getAvatarSrcFromRate(rate)}
                alt='Adyen'
                border='none'
                shape='circle'
                size='x-small'
                className='inline-block align-middle'
              />
            )}{' '}
            <span className='text-lg font-semibold text-black pl-1.5'>
              {rate?.carrier}
            </span>
          </div>
          <div>
            <Spacer bottom='2'>
              <Text size='small' tag='div' variant='info' weight='semibold'>
                Estimated Delivery Date
              </Text>
            </Spacer>
            <div className='text-lg font-semibold text-black'>
              {formatDate({
                isoDate: rate?.delivery_date,
                format: 'date',
                timezone: user?.timezone
              })}
            </div>
          </div>
        </Stack>
      </Spacer>

      {lastEvent != null && (
        <>
          <Legend
            title='Detailed view'
            border='none'
            actionButton={
              <Text size='small' variant='info'>
                Last update:{' '}
                <Text weight='bold'>
                  {formatDate({
                    isoDate: lastEvent.date,
                    format: 'full',
                    timezone: user?.timezone
                  })}
                </Text>
              </Text>
            }
          />
          <div className='rounded-md bg-gray-50 p-6 pb-2'>
            {Object.entries(groupedEvents).map(([date, eventsByDate]) => (
              <div key={date}>
                <Badge
                  data-test-id='timeline-date-group'
                  className='rounded-full bg-gray-200 py-1 px-3 font-bold'
                  label={date}
                  variant='secondary'
                />
                <table className='mt-4 mb-6 ml-1 w-full h-full'>
                  <tbody>
                    {eventsByDate.map((event) => (
                      <tr key={event.date}>
                        <td valign='top' align='right' className='pt-4'>
                          <div className='text-gray-400 text-xs font-bold'>
                            {formatDate({
                              format: 'time',
                              isoDate: event.date,
                              timezone: user?.timezone
                            })}
                          </div>
                        </td>
                        <td valign='top' className='pt-4 px-4'>
                          <div className='flex flex-col items-center gap-1.5 pt-[3px] h-full'>
                            <div className='rounded-full bg-gray-300 w-3 h-3' />
                            {event.position !== 'first' && (
                              <div className='bg-[#E6E7E7] w-[1px] grow' />
                            )}
                          </div>
                        </td>
                        <td valign='top' className='pt-4 w-full pb-6'>
                          <div className='text-black font-semibold -mt-[3px]'>
                            {event.tracking.message}
                          </div>
                          <div className='text-gray-500 text-sm font-semibold'>
                            {event.tracking.tracking_location != null
                              ? `${event.tracking.tracking_location.city}${
                                  event.tracking.tracking_location.country !=
                                  null
                                    ? `, ${event.tracking.tracking_location.country}`
                                    : ''
                                }`
                              : ''}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
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
