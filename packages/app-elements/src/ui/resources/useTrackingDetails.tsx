import type { Parcel as ParcelResource } from "@commercelayer/sdk"
import { useCallback, useMemo, useState } from "react"
import type { SetNonNullable, SetRequired } from "type-fest"
import { formatDate, sortAndGroupByDate } from "#helpers/date"
import {
  getAvatarSrcFromRate,
  getParcelTrackingDetails,
  type Rate,
  type TrackingDetail,
} from "#helpers/tracking"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { Avatar } from "#ui/atoms/Avatar"
import { Badge } from "#ui/atoms/Badge"
import { CopyToClipboard } from "#ui/atoms/CopyToClipboard"
import { Section } from "#ui/atoms/Section"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Stack } from "#ui/atoms/Stack"
import { Steps } from "#ui/atoms/Steps"
import { Text } from "#ui/atoms/Text"
import { Modal } from "#ui/composite/Modal"

export const useTrackingDetails = (parcel: ParcelResource, rate?: Rate) => {
  const [show, setShow] = useState(false)

  const TrackingDetailsModal = useCallback(() => {
    return (
      parcel.tracking_number != null && (
        <Modal show={show} onClose={() => setShow(false)} size="large">
          <Modal.Header>
            <div className="flex gap-1 items-center group pr-7">
              {`${t("common.tracking")} ${parcel.tracking_number}`}
              <CopyToClipboard
                value={parcel.tracking_number}
                showValue={false}
                className="hidden group-hover:inline-block"
              />
            </div>
          </Modal.Header>
          <Modal.Body>
            <TrackingDetails parcel={parcel} rate={rate} />
          </Modal.Body>
        </Modal>
      )
    )
  }, [show, parcel, rate])

  const openTrackingDetails = useCallback(() => setShow(true), [])

  return { TrackingDetailsModal, openTrackingDetails }
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
          tracking,
        ): tracking is SetNonNullableRequired<
          typeof tracking,
          "datetime" | "message"
        > => tracking.datetime != null && tracking.message != null,
      )
      .map((tracking) => ({
        date: tracking.datetime,
        tracking,
      }))

    return sortAndGroupByDate(events, {
      timezone: user?.timezone,
      locale: user?.locale,
    })
  }, [parcel, user?.locale, user?.timezone])

  const lastEvent = Object.values(groupedEvents)[0]?.[0] as Event | undefined

  return (
    <>
      <Steps
        steps={[
          {
            label: t("common.tracking_details.tracking_pre_transit"),
            active: lastEvent?.tracking.status === "pre_transit",
          },
          {
            label: t("common.tracking_details.tracking_in_transit"),
            active: lastEvent?.tracking.status === "in_transit",
          },
          {
            label: t("common.tracking_details.tracking_out_for_delivery"),
            active: lastEvent?.tracking.status === "out_for_delivery",
          },
          {
            label: t("common.tracking_details.tracking_delivered"),
            active: lastEvent?.tracking.status === "delivered",
          },
        ]}
      />
      <Spacer top="12" bottom="14">
        <Stack>
          <div>
            <Spacer bottom="2">
              <Text size="small" tag="div" variant="info" weight="semibold">
                {t("common.tracking_details.courier")}
              </Text>
            </Spacer>
            {rate != null && (
              <Avatar
                src={getAvatarSrcFromRate(rate)}
                alt={rate.carrier}
                border="none"
                shape="circle"
                size="x-small"
                className="inline-block align-middle"
              />
            )}{" "}
            <span className="text-lg font-semibold text-black pl-1.5">
              {rate?.carrier ?? <Text variant="info">N/A</Text>}
            </span>
          </div>
          <div>
            <Spacer bottom="2">
              <Text size="small" tag="div" variant="info" weight="semibold">
                {t("common.tracking_details.estimated_delivery_date")}
              </Text>
            </Spacer>
            <div className="text-lg font-semibold text-black">
              {rate?.delivery_date != null ? (
                formatDate({
                  isoDate: rate.delivery_date,
                  format: "date",
                  timezone: user?.timezone,
                  locale: user?.locale,
                })
              ) : (
                <Text variant="info">N/A</Text>
              )}
            </div>
          </div>
        </Stack>
      </Spacer>

      {lastEvent != null && (
        <Section
          title="Detailed view"
          border="none"
          actionButton={
            <Text size="small" variant="info">
              {t("common.tracking_details.last_update")}:{" "}
              <Text weight="bold">
                {formatDate({
                  isoDate: lastEvent.date,
                  format: "full",
                  timezone: user?.timezone,
                  locale: user?.locale,
                })}
              </Text>
            </Text>
          }
        >
          <div className="rounded-md bg-gray-50 p-6 pb-2">
            {Object.entries(groupedEvents).map(([date, eventsByDate]) => (
              <div key={date}>
                <Badge
                  data-testid="timeline-date-group"
                  className="rounded-full bg-gray-200 py-1 px-3 font-bold"
                  variant="secondary"
                >
                  {date}
                </Badge>
                <table className="mt-4 mb-6 ml-1 w-full h-full">
                  <tbody>
                    {eventsByDate.map((event) => (
                      <tr key={event.date}>
                        <td valign="top" align="right" className="pt-4">
                          <div className="text-gray-400 text-xs font-bold">
                            {formatDate({
                              format: "time",
                              isoDate: event.date,
                              timezone: user?.timezone,
                              locale: user?.locale,
                            })}
                          </div>
                        </td>
                        <td valign="top" className="pt-4 px-4">
                          <div className="flex flex-col items-center gap-1.5 pt-[3px] h-full">
                            <div className="rounded-full bg-gray-300 w-3 h-3" />
                            {event.position !== "first" && (
                              <div className="bg-[#E6E7E7] w-px grow" />
                            )}
                          </div>
                        </td>
                        <td valign="top" className="pt-4 w-full pb-6">
                          <div className="text-black font-semibold -mt-[3px]">
                            {event.tracking.message}
                          </div>
                          <div className="text-gray-500 text-sm font-semibold">
                            {event.tracking.tracking_location != null
                              ? `${event.tracking.tracking_location.city}${
                                  event.tracking.tracking_location.country !=
                                  null
                                    ? `, ${event.tracking.tracking_location.country}`
                                    : ""
                                }`
                              : ""}
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

type SetNonNullableRequired<
  BaseType,
  Keys extends keyof BaseType,
> = SetRequired<SetNonNullable<BaseType, Keys>, Keys>
