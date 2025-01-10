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
import { useOverlay } from '#hooks/useOverlay'
import { t, useTranslation } from '#providers/I18NProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { A } from '#ui/atoms/A'
import { Avatar } from '#ui/atoms/Avatar'
import { Badge } from '#ui/atoms/Badge'
import { Button } from '#ui/atoms/Button'
import { Hr } from '#ui/atoms/Hr'
import { Section } from '#ui/atoms/Section'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Stack } from '#ui/atoms/Stack'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Steps } from '#ui/atoms/Steps'
import { Text } from '#ui/atoms/Text'
import { CardDialog } from '#ui/composite/CardDialog'
import { PageLayout } from '#ui/composite/PageLayout'
import { FlexRow } from '#ui/internals/FlexRow'
import {
  type Parcel as ParcelResource,
  type Shipment as ShipmentResource
} from '@commercelayer/sdk'
import { File, Package } from '@phosphor-icons/react'
import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useMemo } from 'react'
import { type SetNonNullable, type SetRequired } from 'type-fest'
import { ResourceLineItems } from './ResourceLineItems'

type SetNonNullableRequired<
  BaseType,
  Keys extends keyof BaseType
> = SetRequired<SetNonNullable<BaseType, Keys>, Keys>

function hasPackage(
  parcel: ParcelResource
): parcel is SetNonNullableRequired<ParcelResource, 'package'> {
  return parcel.package != null
}

export interface ResourceShipmentParcelsProps {
  shipment: ShipmentResource
  onRemoveParcel?: (parcelId: string) => void
}

export const ResourceShipmentParcels =
  withSkeletonTemplate<ResourceShipmentParcelsProps>(
    ({ shipment, onRemoveParcel }) => {
      const singleTracking = hasSingleTracking(shipment)
      const rate = getShipmentRate(shipment)
      const hasCarrier = rate != null

      return (
        <div
          data-testid={`shipment-parcels-${shipment.id}`}
          className='flex flex-col gap-2'
        >
          {hasCarrier && <Carrier shipment={shipment} />}
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
                  singleTracking && hasCarrier
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
    }
  )

ResourceShipmentParcels.displayName = 'ResourceShipmentParcels'

const Parcel = withSkeletonTemplate<{
  parcel: SetNonNullableRequired<ParcelResource, 'package'>
  rate?: Rate
  showEstimatedDelivery?: boolean
  onRemove?: () => void
}>(({ parcel, rate, showEstimatedDelivery = false, onRemove }) => {
  const { t } = useTranslation()
  const itemsLength =
    parcel.parcel_line_items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <CardDialog
      data-testid={`parcel-box-${parcel.id}`}
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
        <ResourceLineItems items={parcel.parcel_line_items} size='small' />
      )}
      <Spacer top='6'>
        <Text size='small'>
          <FlexRow>
            <Text variant='info'>{t('common.parcel_total')}</Text>
            <Text weight='semibold'>
              {t('apps.shipments.details.parcel_item', {
                count: itemsLength
              })}
            </Text>
          </FlexRow>
          <Spacer top='4'>
            <FlexRow>
              <Text variant='info'>{t('common.parcel_weight')}</Text>
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
          <Attachments parcel={parcel} />
          <CustomsInfo parcel={parcel} />
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
      data-testid={`carrier-box-${shipment.id}`}
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

/**
 * Showing the first 3 attachments that have an URL.
 * It is assumed that attachments are return labels generated by easypost.
 */
const Attachments = withSkeletonTemplate<{
  parcel: ParcelResource
}>(({ parcel }) => {
  const attachmentsWithUrl = parcel.attachments
    ?.filter((attachment) => attachment.url != null)
    ?.slice(0, 3)

  if (attachmentsWithUrl == null || attachmentsWithUrl.length === 0) {
    return null
  }

  return (
    <FlexRow className='mt-4'>
      <Text variant='info'>{t('common.attachments')}</Text>
      <Text weight='semibold'>
        <div className='flex flex-col gap-2 items-end'>
          {attachmentsWithUrl.map((attachment) => (
            <A
              key={attachment.id}
              href={attachment.url ?? ''}
              target='_blank'
              rel='noopener'
              className='flex items-center gap-1'
            >
              <File weight='bold' /> {attachment.name}
            </A>
          ))}
        </div>
      </Text>
    </FlexRow>
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
      {trackingDetails?.status != null ? (
        <FlexRow className='mt-4'>
          <Text variant='info'>{t('common.status')}</Text>
          <Text weight='semibold'>{trackingDetails.status}</Text>
        </FlexRow>
      ) : parcel.tracking_status != null ? (
        <FlexRow className='mt-4'>
          <Text variant='info'>{t('common.status')}</Text>
          <Text weight='semibold'>{parcel.tracking_status}</Text>
        </FlexRow>
      ) : null}
      {parcel.tracking_number != null && (
        <FlexRow className='mt-4'>
          <Text variant='info'>{t('common.tracking')}</Text>
          <Text weight='semibold'>
            {trackingDetails != null ? (
              <Button
                variant='link'
                onClick={() => {
                  openTrackingDetails()
                }}
              >
                {parcel.tracking_number}
              </Button>
            ) : (
              parcel.tracking_number
            )}
          </Text>
        </FlexRow>
      )}
      {showEstimatedDelivery && rate?.formatted_delivery_date != null && (
        <FlexRow className='mt-4'>
          <Text variant='info'>{t('common.estimated_delivery')}</Text>
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
  } = useOverlay({
    queryParam: `tracking-${parcel.tracking_number ?? ''}`
  })

  const TrackingDetailsOverlay = useCallback(() => {
    return (
      parcel.tracking_number != null && (
        <Overlay>
          <PageLayout
            title={`${t('common.tracking')} #${parcel.tracking_number}`}
            navigationButton={{
              label: 'Back',
              onClick: () => {
                close()
              }
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
            label: t('common.tracking_details.tracking_pre_transit'),
            active: lastEvent?.tracking.status === 'pre_transit'
          },
          {
            label: t('common.tracking_details.tracking_in_transit'),
            active: lastEvent?.tracking.status === 'in_transit'
          },
          {
            label: t('common.tracking_details.tracking_out_for_delivery'),
            active: lastEvent?.tracking.status === 'out_for_delivery'
          },
          {
            label: t('common.tracking_details.tracking_delivered'),
            active: lastEvent?.tracking.status === 'delivered'
          }
        ]}
      />
      <Spacer top='12' bottom='14'>
        <Stack>
          <div>
            <Spacer bottom='2'>
              <Text size='small' tag='div' variant='info' weight='semibold'>
                {t('common.tracking_details.courier')}
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
                {t('common.tracking_details.estimated_delivery_date')}
              </Text>
            </Spacer>
            <div className='text-lg font-semibold text-black'>
              {formatDate({
                isoDate: rate?.delivery_date,
                format: 'date',
                timezone: user?.timezone,
                locale: user?.locale
              })}
            </div>
          </div>
        </Stack>
      </Spacer>

      {lastEvent != null && (
        <Section
          title='Detailed view'
          border='none'
          actionButton={
            <Text size='small' variant='info'>
              {t('common.tracking_details.last_update')}:{' '}
              <Text weight='bold'>
                {formatDate({
                  isoDate: lastEvent.date,
                  format: 'full',
                  timezone: user?.timezone,
                  locale: user?.locale
                })}
              </Text>
            </Text>
          }
        >
          <div className='rounded-md bg-gray-50 p-6 pb-2'>
            {Object.entries(groupedEvents).map(([date, eventsByDate]) => (
              <div key={date}>
                <Badge
                  data-testid='timeline-date-group'
                  className='rounded-full bg-gray-200 py-1 px-3 font-bold'
                  variant='secondary'
                >
                  {date}
                </Badge>
                <table className='mt-4 mb-6 ml-1 w-full h-full'>
                  <tbody>
                    {eventsByDate.map((event) => (
                      <tr key={event.date}>
                        <td valign='top' align='right' className='pt-4'>
                          <div className='text-gray-400 text-xs font-bold'>
                            {formatDate({
                              format: 'time',
                              isoDate: event.date,
                              timezone: user?.timezone,
                              locale: user?.locale
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
        </Section>
      )}
    </>
  )
})

const PrintLabel = withSkeletonTemplate<{ href: string }>(({ href }) => {
  return (
    <div className='text-center'>
      <A href={href}>
        <StatusIcon gap='small' className='text-2xl mr-1' name='printer' />{' '}
        <Text size='small'>{t('common.print_shipping_label')}</Text>
      </A>
    </div>
  )
})

const CustomsInfo = withSkeletonTemplate<{ parcel: ParcelResource }>(
  ({ parcel }) => {
    const hasCustomsInfo = useMemo(
      () =>
        !isEmpty(parcel.incoterm) ||
        !isEmpty(parcel.delivery_confirmation) ||
        !isEmpty(parcel.eel_pfc) ||
        !isEmpty(parcel.contents_type) ||
        !isEmpty(parcel.contents_explanation) ||
        !isEmpty(parcel.non_delivery_option) ||
        !isEmpty(parcel.restriction_type) ||
        !isEmpty(parcel.restriction_comments) ||
        !isEmpty(parcel.customs_signer) ||
        !isEmpty(parcel.customs_certify),
      [parcel]
    )

    if (!hasCustomsInfo) {
      return null
    }

    return (
      <div>
        <Spacer top='4' bottom='4'>
          <Hr variant='dashed' />
        </Spacer>

        {!isEmpty(parcel.incoterm) && (
          <FlexRow>
            <Text variant='info' wrap='nowrap'>
              Incoterm
            </Text>
            <Text weight='semibold'>{parcel.incoterm}</Text>
          </FlexRow>
        )}

        {!isEmpty(parcel.delivery_confirmation) && (
          <Spacer top='4'>
            <FlexRow>
              <Text variant='info' wrap='nowrap'>
                {t('common.tracking_details.delivery_confirmation')}
              </Text>
              <Text weight='semibold'>{parcel.delivery_confirmation}</Text>
            </FlexRow>
          </Spacer>
        )}

        {parcel.customs_info_required === true && (
          <Spacer top='4' bottom='4'>
            <Hr variant='dashed' />
          </Spacer>
        )}

        {!isEmpty(parcel.eel_pfc) && (
          <Spacer top='4'>
            <FlexRow>
              <Text variant='info' wrap='nowrap'>
                EEL/PFC
              </Text>
              <Text weight='semibold'>{parcel.eel_pfc}</Text>
            </FlexRow>
          </Spacer>
        )}

        {!isEmpty(parcel.contents_type) && (
          <Spacer top='4'>
            <FlexRow>
              <Text variant='info' wrap='nowrap'>
                {t('common.tracking_details.contents_type')}
              </Text>
              <Text weight='semibold'>
                {/* `contents_explanation` is optional but if exists it means `contents_type` is set. So if it exists we give it priority */}
                {parcel.contents_explanation ?? parcel.contents_type}
              </Text>
            </FlexRow>
          </Spacer>
        )}

        {!isEmpty(parcel.non_delivery_option) && (
          <Spacer top='4'>
            <FlexRow>
              <Text variant='info' wrap='nowrap'>
                {t('common.tracking_details.non_delivery_option')}
              </Text>
              <Text weight='semibold'>{parcel.non_delivery_option}</Text>
            </FlexRow>
          </Spacer>
        )}

        {!isEmpty(parcel.restriction_type) && (
          <Spacer top='4'>
            <FlexRow>
              <Text variant='info'>
                {t('common.tracking_details.restriction_type')}
              </Text>
              <Text weight='semibold'>
                {parcel.restriction_type}{' '}
                {parcel.restriction_comments != null
                  ? ` - ${parcel.restriction_comments}`
                  : ''}
              </Text>
            </FlexRow>
          </Spacer>
        )}

        {!isEmpty(parcel.customs_signer) && (
          <Spacer top='4'>
            <FlexRow>
              <Text variant='info' wrap='nowrap'>
                {t('common.tracking_details.customs_signer')}
              </Text>
              <Text weight='semibold'>{parcel.customs_signer}</Text>
            </FlexRow>
          </Spacer>
        )}

        {!isEmpty(parcel.customs_certify) && (
          <Spacer top='4'>
            <FlexRow>
              <Text variant='info' wrap='nowrap'>
                {t('common.tracking_details.customs_certify')}
              </Text>
              <Text weight='semibold'>
                {parcel.customs_certify === true ? 'Yes' : 'No'}
              </Text>
            </FlexRow>
          </Spacer>
        )}
      </div>
    )
  }
)
