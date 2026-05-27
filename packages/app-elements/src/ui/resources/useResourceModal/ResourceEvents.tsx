import type { EventStore } from "@commercelayer/sdk"
import { type FC, useCallback, useMemo, useState } from "react"
import z from "zod"
import { formatDate, getIsoDateAtDayEdge } from "#helpers/date"
import { formatDisplayName } from "#helpers/name"
import { useCoreApi } from "#providers/CoreSdkProvider/useCoreApi"
import { useTokenProvider } from "#providers/TokenProvider"
import { Card } from "#ui/atoms/Card"
import { CodeBlock } from "#ui/atoms/CodeBlock"
import { Icon } from "#ui/atoms/Icon"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { useResourceList } from "#ui/resources/useResourceList"
import { VisibilityTrigger } from "#ui/resources/useResourceList/VisibilityTrigger"
import type { UseResourceModalConfig } from "./useResourceModal"

type Props = Pick<UseResourceModalConfig, "resourceType" | "resourceId">

export const ResourceEvents: FC<Props> = ({ resourceType, resourceId }) => {
  const { data: organization } = useCoreApi("organization", "retrieve", [])
  const {
    settings: { mode },
  } = useTokenProvider()

  const resourceEvents = useCallback(() => {
    if (organization == null) {
      return null
    }

    if (
      organization?.config?.api == null ||
      organization?.config?.api?.stream == null ||
      (organization?.config?.api?.stream?.scope !== mode &&
        organization?.config?.api?.stream?.scope !== "both")
    ) {
      return (
        <EventStoreCard>
          <Text className="text-gray-300">
            <Icon name="info" size={28} />
          </Text>
          <Text variant="info" align="center">
            Event Stream Hub is not available for this organization.
            <br />
            You can enable it in Settings &gt; Organization.
          </Text>
        </EventStoreCard>
      )
    }

    return (
      <EventStoreItems resourceType={resourceType} resourceId={resourceId} />
    )
  }, [organization, mode, resourceType, resourceId])

  return <Spacer top="4">{resourceEvents()}</Spacer>
}

const EventStoreItems: FC<Props> = ({ resourceType, resourceId }) => {
  const { user } = useTokenProvider()
  const {
    list: eventStores,
    isLoading,
    hasMorePages,
    fetchMore,
  } = useResourceList({
    type: "event_stores",
    query: {
      filters: {
        resource_type_eq: resourceType,
        resource_id_eq: resourceId,
      },
    },
    paginationType: "infinite",
  })

  /**
   * Group events by the day they were created, using the user's timezone if available, or UTC as a fallback.
   * Events within each day are sorted in descending order by their creation time.
   */
  const timezone = user?.timezone ?? "UTC"
  const groupedEventsByDate = useMemo(() => {
    const grouped: Record<string, EventStore[]> = {}

    for (const currentEvent of eventStores ?? []) {
      const date = getIsoDateAtDayEdge({
        isoString: currentEvent.created_at,
        edge: "startOfTheDay",
        timezone,
      })

      if (date == null) {
        continue
      }

      if (grouped[date] == null) {
        grouped[date] = []
      }
      grouped[date].push(currentEvent)
    }

    Object.values(grouped).forEach((events) => {
      events.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    })

    return grouped
  }, [eventStores, timezone])

  return (
    <>
      {eventStores != null && eventStores.length === 0 && !isLoading ? (
        <Text variant="info" align="center">
          No events found for this resource.
        </Text>
      ) : (
        <div className="pb-4">
          {Object.entries(groupedEventsByDate).map(([day, events], idx) => (
            <div key={day}>
              <Spacer bottom="4" top={idx === 0 ? undefined : "12"}>
                <Text weight="semibold" size="small">
                  {formatDate({ isoDate: day, format: "date", timezone })}
                </Text>
              </Spacer>
              {events?.map((eventStore) => (
                <EventStoreItem key={eventStore.id} eventStore={eventStore} />
              ))}
            </div>
          ))}
          {isLoading && (
            <EventStoreItem
              eventStore={mockedEventStore}
              delayMs={0}
              isLoading
            />
          )}
          <VisibilityTrigger
            enabled={hasMorePages ?? false}
            callback={(entry) => {
              if (entry.isIntersecting) {
                void fetchMore()
              }
            }}
          />
        </div>
      )}
    </>
  )
}

const EventStoreCard: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="rounded bg-gray-50 p-4 h-full flex items-center">
      <div className="flex flex-col items-center justify-center w-full h-full gap-3">
        {children}
      </div>
    </div>
  )
}

const EventStoreItem = withSkeletonTemplate<{
  eventStore: EventStore
}>((props) => {
  const { user } = useTokenProvider()
  const eventStore = eventParser.safeParse(props.eventStore)?.data
  const [isOpen, setIsOpen] = useState(false)

  if (eventStore == null) {
    return null
  }

  const who = resolveWho(eventStore)

  const attributes = Object.keys(eventStore.payload).filter(
    (attr) => !["updated_at"].includes(attr),
  )

  return (
    <Spacer bottom="2">
      <Card
        overflow="visible"
        gap="4"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded!"
      >
        <div className="flex justify-between text-sm gap-8">
          <div>
            <Text weight="bold">{who}</Text>{" "}
            <Text variant="info">
              {eventToPastTense[eventStore.event]}{" "}
              {attributes.slice(0, 2).join(", ")}
              {attributes.length > 3 && (
                <span>, and {attributes.length - 3} more</span>
              )}
            </Text>
          </div>
          <div className="whitespace-nowrap">
            <Text variant="info" className="text-xs">
              {formatDate({
                isoDate: eventStore.created_at,
                format: "timeWithSeconds",
                timezone: user?.timezone,
              })}
            </Text>
          </div>
        </div>
        {isOpen && (
          <Spacer top="4">
            <CodeBlock>{eventStore}</CodeBlock>
          </Spacer>
        )}
      </Card>
    </Spacer>
  )
})

const eventEnum = ["create", "update", "destroy"] as const

const eventToPastTense: Record<(typeof eventEnum)[number], string> = {
  create: "created",
  update: "updated",
  destroy: "deleted",
}

function resolveWho(eventStore: z.infer<typeof eventParser>): string {
  const who = eventStore.who
  if (who == null) {
    return "System"
  }

  const { owner, application, worker } = who

  if (owner?.first_name != null) {
    return formatDisplayName(owner.first_name, owner.last_name)
  }
  if (owner != null) {
    return "Customer"
  }
  if (application != null) {
    return "Application"
  }
  if (worker != null) {
    return `Worker (${worker.type})`
  }

  return "System"
}

const eventParser = z.object({
  id: z.string(),
  type: z.literal("event_stores"),
  created_at: z.string(),
  updated_at: z.string(),
  event: z.enum(eventEnum),
  payload: z.record(
    z.object({
      from: z.any(),
      to: z.any(),
    }),
  ),
  who: z.object({
    worker: z
      .object({
        id: z.string(),
        type: z.string(),
      })
      .optional(),
    application: z
      .object({
        id: z.string(),
        client_id: z.string(),
        kind: z.string(),
      })
      .optional(),
    owner: z
      .object({
        email: z.string(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
      })
      .optional(),
  }),
})

const mockedEventStore: EventStore = {
  id: "fake-event-store",
  type: "event_stores",
  created_at: "2025-08-01T13:53:49.920Z",
  updated_at: "2025-08-01T13:53:49.920Z",
  event: "create",
  payload: {
    fulfillment_status: {
      from: "unfulfilled",
      to: "in_progress",
    },
  },
  who: {
    application: {
      id: "fake-application-id",
      client_id: "",
      kind: "sales_channel",
    },
  },
}
