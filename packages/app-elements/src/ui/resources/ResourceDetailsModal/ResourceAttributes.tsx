import type { Resource } from "@commercelayer/sdk"
import cn from "classnames"
import capitalize from "lodash-es/capitalize"
import lowerCase from "lodash-es/lowerCase"
import { type FC, type ReactNode, useState } from "react"
import type { JsonObject } from "type-fest"
import { formatDate } from "#helpers/date"
import { type I18NLocale, t } from "#providers/i18n"
import { useTokenProvider } from "#providers/TokenProvider"
import { Button } from "#ui/atoms/Button"
import { CodeBlock } from "#ui/atoms/CodeBlock"
import { Icon } from "#ui/atoms/Icon"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Text } from "#ui/atoms/Text"
import { splitResourceFields } from "./resourceFields"

/**
 * Lists a resource's plain attributes as a single flat list, led by its id and
 * type. Relationships are filtered out: they are rendered by whoever owns that
 * concern, so they don't leak into this list as raw JSON.
 */
export const ResourceAttributes = withSkeletonTemplate<{ resource: Resource }>(
  ({ resource }) => {
    const { attributes } = splitResourceFields(resource)

    return (
      // a container, so labels follow the width of the panel rather than the
      // window's: the same list fills a modal or a narrow column
      <div className="@container">
        <AttributeRow label="ID">
          <AttributeValue value={resource.id} />
        </AttributeRow>
        <AttributeRow label="Type">
          <AttributeValue value={resource.type} />
        </AttributeRow>
        {attributes.map((attribute) => (
          <AttributeItem
            key={[resource.id, attribute].join("-")}
            attribute={attribute}
            value={resource[attribute as keyof Resource]}
          />
        ))}
      </div>
    )
  },
)

/**
 * A label on the left, its value right-aligned. In a wide enough panel, labels
 * stay on one line and take at least the same width, so values line up when
 * labels are short and a longer one widens its own row. In a narrow one they
 * keep that width and wrap, so a long label never pushes the value out of view.
 */
const AttributeRow: FC<{
  label: string
  hasBorder?: boolean
  children: ReactNode
}> = ({ label, hasBorder = true, children }) => (
  <div
    className={cn("flex items-center gap-4 py-3", {
      "border-b border-gray-100": hasBorder,
    })}
  >
    <Text
      size="xx-small"
      weight="medium"
      variant="info"
      className="font-mono w-45 shrink-0 @md:w-auto @md:min-w-45 @md:whitespace-nowrap"
    >
      {label}
    </Text>
    <div className="flex-1 min-w-0 flex justify-end text-right">{children}</div>
  </div>
)

const AttributeValue: FC<{ value: unknown }> = ({ value }) => {
  const { user } = useTokenProvider()

  if (value == null || value === "") {
    return (
      <Text
        size="xx-small"
        weight="semibold"
        variant="disabled"
        className="font-mono"
      >
        &#8212;
      </Text>
    )
  }

  return (
    <Text
      size="xx-small"
      weight="semibold"
      className="break-all tabular-nums font-mono"
    >
      {getDisplayValue(value, user?.timezone, user?.locale)}
    </Text>
  )
}

/** An ISO date and time, as the API returns for `created_at` and the like. */
const isoDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/

/**
 * The value as text: a date and time in full, year and seconds included, in
 * the user's timezone; anything else as it is.
 */
function getDisplayValue(
  value: unknown,
  timezone?: string,
  locale?: I18NLocale,
): string {
  if (typeof value !== "string" || !isoDateTime.test(value)) {
    return String(value)
  }

  return formatDate({
    isoDate: value,
    format: "fullWithSeconds",
    showCurrentYear: true,
    timezone,
    locale,
  })
}

const AttributeItem = withSkeletonTemplate<{
  attribute: string
  value: unknown
}>(({ attribute, value }) => {
  const [showJson, setShowJson] = useState(false)
  const label = capitalize(lowerCase(attribute))

  if (value == null || typeof value !== "object") {
    return (
      <AttributeRow label={label}>
        <AttributeValue value={value} />
      </AttributeRow>
    )
  }

  return (
    <>
      <AttributeRow label={label} hasBorder={!showJson}>
        <Button
          variant="secondary"
          size="mini"
          disabled={Object.keys(value as JsonObject).length === 0}
          onClick={() => {
            setShowJson((current) => !current)
          }}
        >
          <Icon name="bracketsCurly" size={14} />
          <Text weight="medium" size="x-small">
            {t("common.resource_details.json")}
          </Text>
        </Button>
      </AttributeRow>
      {showJson && (
        <div className="pb-3 border-b border-gray-100">
          <CodeBlock>{value as JsonObject}</CodeBlock>
        </div>
      )}
    </>
  )
})
