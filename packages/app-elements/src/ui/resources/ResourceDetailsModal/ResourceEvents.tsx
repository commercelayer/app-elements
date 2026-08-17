import type {
  EventStore,
  ListResponse,
  QueryParamsList,
  ResourceTypeLock,
} from "@commercelayer/sdk"
import cn from "classnames"
import { type FC, useMemo, useState } from "react"
import z from "zod"
import { formatDate, getIsoDateAtDayEdge } from "#helpers/date"
import { isMockedId } from "#helpers/mocks"
import { formatDisplayName } from "#helpers/name"
import { t } from "#providers/I18NProvider"
import { useTokenProvider } from "#providers/TokenProvider"
import { A } from "#ui/atoms/A"
import { Card } from "#ui/atoms/Card"
import { CodeBlock } from "#ui/atoms/CodeBlock"
import { Icon } from "#ui/atoms/Icon"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import {
  getNextCursor,
  useInfiniteScrollCursor,
} from "./useInfiniteScrollCursor"

const PAGE_SIZE = 25

/**
 * Timeline of a resource's event stores, newest first, grouped by day and
 * paginated as the user scrolls.
 *
 * Event stores are part of the Event Stream Hub, so organizations without it
 * see an upsell instead. Enterprise-ness is read from the token provider
 * extras. When it is absent (an app running outside the dashboard, where
 * nothing populates it) the upsell is shown rather than the timeline.
 */
export const ResourceEvents: FC<{
  resourceId: string
  resourceType: ResourceTypeLock
}> = ({ resourceId, resourceType }) => {
  const { user, settings } = useTokenProvider()

  if (settings.extras?.organization?.isEnterprise !== true) {
    return (
      <EventsPlaceholder>
        <Text className="text-gray-300 mb-3">
          <Icon name="arrowCircleUp" size={32} weight="regular" />
        </Text>
        <Text weight="bold">{t("common.resource_details.unlock_title")}</Text>
        <Text variant="info" size="small" align="center">
          {t("common.resource_details.unlock_description")}
        </Text>
        <div className="flex gap-2 mt-3">
          <A
            href="https://docs.commercelayer.io/core-api-reference/event_stores"
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            {t("common.resource_details.learn_more")}
          </A>
          <A
            href={`https://commercelayer.fillout.com/t/n7qbQBzH63us?product=events&email=${user?.email ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className="inline-flex items-center"
          >
            {t("common.resource_details.contact_sales")}
          </A>
        </div>
      </EventsPlaceholder>
    )
  }

  return <EventStoreItems id={resourceId} type={resourceType} />
}

const EventsPlaceholder: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded bg-gray-50 p-4 h-full flex items-center min-h-120">
    <div className="flex flex-col items-center justify-center w-full h-full gap-1">
      {children}
    </div>
  </div>
)

/** Reads the `event_stores` relationship for the resource types that expose it. */
type EventStoresReader = Record<
  ResourceTypeLock,
  {
    event_stores: (
      parentId: string,
      params?: QueryParamsList<EventStore>,
    ) => Promise<ListResponse<EventStore>>
  }
>

const EventStoreItems = withSkeletonTemplate<{
  id: string
  type: ResourceTypeLock
}>(({ id, type }) => {
  const { user } = useTokenProvider()
  const { data, isLoading, isLoadingMore, VisibilityTrigger } =
    useInfiniteScrollCursor<ListResponse<EventStore>>(
      ({ sdkClient, previousPageData }) => {
        if (isMockedId(id)) {
          return null
        }

        const pageAfter = getNextCursor(previousPageData)

        return {
          key: ["event_stores", type, id, pageAfter ?? "first"],
          fetch: async () =>
            // Not every resource type exposes an `event_stores` relationship in
            // the SDK types, so we narrow the client to the reader we need.
            await (sdkClient as unknown as EventStoresReader)[
              type
            ].event_stores(id, {
              pageSize: PAGE_SIZE,
              sort: { id: "desc" },
              pageAfter,
            }),
        }
      },
    )

  const eventStores = data as EventStore[] | undefined
  const timezone = user?.timezone ?? "UTC"

  const groupedEventsByDate = useMemo(
    () =>
      (eventStores ?? []).reduce<Record<string, EventStore[]>>(
        (grouped, currentEvent) => {
          const date = getIsoDateAtDayEdge({
            isoString: currentEvent.created_at,
            edge: "startOfTheDay",
            timezone,
          })

          if (date == null) {
            return grouped
          }

          return {
            ...grouped,
            [date]: [...(grouped[date] ?? []), currentEvent],
          }
        },
        {},
      ),
    [eventStores, timezone],
  )

  if (eventStores != null && eventStores.length === 0 && !isLoading) {
    return (
      <Text className="text-center text-gray-500">
        {t("common.resource_details.no_events")}
      </Text>
    )
  }

  return (
    <>
      {Object.entries(groupedEventsByDate).map(([day, events], idx) => (
        <div key={day}>
          <Spacer bottom="4" top={idx === 0 ? undefined : "12"}>
            <Text weight="semibold">
              {formatDate({ isoDate: day, format: "date", timezone })}
            </Text>
          </Spacer>
          {events?.map((eventStore) => (
            <EventStoreItem key={eventStore.id} eventStore={eventStore} />
          ))}
        </div>
      ))}

      {(isLoading || isLoadingMore) && (
        <EventStoreItem eventStore={mockedEventStore} delayMs={0} isLoading />
      )}
      <VisibilityTrigger />
    </>
  )
})

const EventStoreItem = withSkeletonTemplate<{ eventStore: EventStore }>(
  (props) => {
    const { user } = useTokenProvider()
    const eventStore = eventParser.safeParse(props.eventStore)?.data
    const [isOpen, setIsOpen] = useState(false)

    if (eventStore == null) {
      return (
        <Spacer bottom="2">
          <Card overflow="visible" gap="4" className="w-full">
            <Text variant="info">
              {t("common.resource_details.unknown_event")}
            </Text>
          </Card>
        </Spacer>
      )
    }

    const attributes = Object.keys(eventStore.payload).filter(
      (attr) => !["updated_at"].includes(attr),
    )

    return (
      <Spacer bottom="2">
        <Card
          gap="none"
          className={cn(
            "w-full rounded! hover:border-black hover:shadow-cardhover",
            { "border-black! shadow-cardhover!": isOpen },
          )}
        >
          <button
            type="button"
            className="w-full flex items-center justify-between text-sm gap-8 select-none p-4"
            onClick={() => {
              setIsOpen(!isOpen)
            }}
          >
            <div>
              <div className="flex gap-1">
                <Text weight="bold">{resolveWho(eventStore)}</Text>
                <Text variant="info">
                  {formatDate({
                    isoDate: eventStore.created_at,
                    format: "timeWithSeconds",
                    timezone: user?.timezone,
                  })}
                </Text>
              </div>
              <div className="flex gap-1">
                <Text variant="info">
                  {t(`common.resource_details.event_${eventStore.event}`)}
                </Text>
                <Text variant="info">
                  {attributes.slice(0, 1).join(", ")}
                  {attributes.length > 1 && (
                    <span>
                      {" "}
                      {t("common.resource_details.and_more", {
                        count: attributes.length - 1,
                      })}
                    </span>
                  )}
                </Text>
              </div>
            </div>
            <div className="whitespace-nowrap">
              <Icon
                name={isOpen ? "caretUp" : "caretDown"}
                size={16}
                weight="bold"
              />
            </div>
          </button>
          {isOpen && (
            <div className="hover:cursor-auto mx-4 mb-4">
              <CodeBlock>{eventStore}</CodeBlock>
            </div>
          )}
        </Card>
      </Spacer>
    )
  },
)

// TODO: This should be inferred from api schema def (`EventStore['event']`),
// but it currently arrives typed as string.
const changeEventEnum = ["create", "update", "destroy"] as const
const anonymizationEventEnum = [
  "anonymization_request",
  "anonymization_started",
  "anonymization_completed",
  "anonymization_failed",
  "anonymization_cancel",
] as const

function resolveWho(eventStore: z.infer<typeof eventParser>): string {
  const who = eventStore.who
  if (who == null) {
    return t("common.resource_details.who_system")
  }

  const { owner, application, worker } = who

  if (owner?.first_name != null) {
    return formatDisplayName(owner.first_name, owner.last_name ?? "")
  }
  if (owner != null) {
    return t("common.resource_details.who_customer")
  }
  if (application != null) {
    return t("common.resource_details.who_application")
  }
  if (worker != null) {
    return t("common.resource_details.who_worker", { type: worker.type })
  }

  return t("common.resource_details.who_system")
}

const whoSchema = z.object({
  worker: z.object({ id: z.string(), type: z.string() }).optional(),
  application: z
    .object({ id: z.string(), client_id: z.string(), kind: z.string() })
    .optional(),
  owner: z
    .object({
      email: z.string(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
    })
    .optional(),
})

const baseEventSchema = z.object({
  id: z.string(),
  type: z.literal("event_stores"),
  created_at: z.string(),
  updated_at: z.string(),
  who: whoSchema,
})

const anonymizationRequesterSchema = z.object({
  email: z.string(),
  hashid: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

const eventParser = z.discriminatedUnion("event", [
  baseEventSchema.extend({
    event: z.enum(changeEventEnum),
    payload: z.record(z.object({ from: z.any(), to: z.any() })),
  }),
  baseEventSchema.extend({
    event: z.enum(anonymizationEventEnum),
    payload: z.object({
      status: z.string().optional(),
      requested_at: z.string().optional(),
      started_at: z.string().optional(),
      completed_at: z.string().optional(),
      failed_at: z.string().optional(),
      cancelled_at: z.string().optional(),
      requester: anonymizationRequesterSchema.optional(),
      cancellation_requester: anonymizationRequesterSchema.optional(),
    }),
  }),
])

const mockedEventStore: EventStore = {
  id: "fake-event-store",
  type: "event_stores",
  created_at: "2025-08-01T13:53:49.920Z",
  updated_at: "2025-08-01T13:53:49.920Z",
  event: "create",
  payload: {
    fulfillment_status: { from: "unfulfilled", to: "in_progress" },
  },
  who: {
    application: {
      id: "fake-application-id",
      client_id: "",
      kind: "sales_channel",
    },
  },
}
