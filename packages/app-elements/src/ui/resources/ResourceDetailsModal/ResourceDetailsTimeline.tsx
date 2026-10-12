import cn from "classnames"
import { type ReactNode, useMemo, useState } from "react"
import type { JsonObject } from "type-fest"
import { formatDate, getIsoDateAtDayEdge } from "#helpers/date"
import { useTokenProvider } from "#providers/TokenProvider"
import { Card } from "#ui/atoms/Card"
import { CodeBlock } from "#ui/atoms/CodeBlock"
import { Icon } from "#ui/atoms/Icon"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"

export interface ResourceDetailsTimelineProps<Item> {
  /** Items in the order they are shown, newest first. */
  items: Item[]
  /** The item's ISO date, used to group it under its day. */
  getDate: (item: Item) => string
  getKey: (item: Item) => string
  renderItem: (item: Item) => ReactNode
}

/**
 * A list of items grouped by day, with a date heading for each day in the user's
 * timezone. It is the layout of the Events tab of `useResourceDetailsModal`, so a
 * custom tab listing dated items (e.g. payment transactions) looks the same.
 */
export function ResourceDetailsTimeline<Item>({
  items,
  getDate,
  getKey,
  renderItem,
}: ResourceDetailsTimelineProps<Item>): React.JSX.Element {
  const { user } = useTokenProvider()
  const timezone = user?.timezone ?? "UTC"

  const groupedByDay = useMemo(
    () =>
      items.reduce<Record<string, Item[]>>((grouped, item) => {
        const day = getIsoDateAtDayEdge({
          isoString: getDate(item),
          edge: "startOfTheDay",
          timezone,
        })

        if (day == null) {
          return grouped
        }

        return { ...grouped, [day]: [...(grouped[day] ?? []), item] }
      }, {}),
    [items, getDate, timezone],
  )

  return (
    <>
      {Object.entries(groupedByDay).map(([day, dayItems], idx) => (
        <div key={day}>
          <Spacer bottom="4" top={idx === 0 ? undefined : "12"}>
            <Text weight="semibold">
              {formatDate({ isoDate: day, format: "date", timezone })}
            </Text>
          </Spacer>
          {dayItems.map((item) => (
            <div key={getKey(item)}>{renderItem(item)}</div>
          ))}
        </div>
      ))}
    </>
  )
}

export interface ResourceDetailsTimelineItemProps {
  /** Shown in bold. The time of `isoDate` sits on the right, next to the caret. */
  title: ReactNode
  isoDate: string
  /** The second line, under the title. */
  description?: ReactNode
  /** Shown as JSON when the item is expanded. */
  code: string | JsonObject
}

/**
 * An expandable card of a `ResourceDetailsTimeline`: a title with the time, a
 * description, and the raw JSON once opened.
 */
export function ResourceDetailsTimelineItem({
  title,
  isoDate,
  description,
  code,
}: ResourceDetailsTimelineItemProps): React.JSX.Element {
  const { user } = useTokenProvider()
  const [isOpen, setIsOpen] = useState(false)

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
              <Text weight="bold">{title}</Text>
            </div>
            {description != null && (
              <div className="flex gap-1">
                <Text variant="info">{description}</Text>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Text variant="info" size="x-small">
              {formatDate({
                isoDate,
                format: "timeWithSeconds",
                timezone: user?.timezone,
              })}
            </Text>
            {/* gray-500 is the color of `Text variant="info"`, used by the time */}
            <Icon
              name={isOpen ? "caretUp" : "caretDown"}
              size={12}
              weight="bold"
              className="text-gray-500"
            />
          </div>
        </button>
        {isOpen && (
          <div className="hover:cursor-auto mx-4 mb-4">
            <CodeBlock>{code}</CodeBlock>
          </div>
        )}
      </Card>
    </Spacer>
  )
}
