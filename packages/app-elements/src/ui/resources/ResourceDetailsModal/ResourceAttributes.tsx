import type { Resource } from "@commercelayer/sdk"
import cn from "classnames"
import capitalize from "lodash-es/capitalize"
import lowerCase from "lodash-es/lowerCase"
import { type FC, type ReactNode, useState } from "react"
import type { JsonObject } from "type-fest"
import { t } from "#providers/i18n"
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
      <div>
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
 * A label on the left, its value right-aligned. Labels share a fixed width so
 * values line up whatever the label length.
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
      size="x-small"
      weight="medium"
      variant="info"
      className="font-mono w-45 shrink-0"
    >
      {label}
    </Text>
    <div className="flex-1 min-w-0 flex justify-end text-right">{children}</div>
  </div>
)

const AttributeValue: FC<{ value: unknown }> = ({ value }) => {
  if (value == null || value === "") {
    return (
      <Text
        size="x-small"
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
      size="x-small"
      weight="semibold"
      className="break-all tabular-nums font-mono"
    >
      {String(value)}
    </Text>
  )
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
