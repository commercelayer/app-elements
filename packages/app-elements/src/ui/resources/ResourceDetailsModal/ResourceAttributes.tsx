import type { Resource } from "@commercelayer/sdk"
import capitalize from "lodash-es/capitalize"
import lowerCase from "lodash-es/lowerCase"
import { type FC, useState } from "react"
import type { JsonObject } from "type-fest"
import { t } from "#providers/I18NProvider"
import { Button } from "#ui/atoms/Button"
import { Card } from "#ui/atoms/Card"
import { CodeBlock } from "#ui/atoms/CodeBlock"
import { Icon } from "#ui/atoms/Icon"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { ListItem } from "#ui/composite/ListItem"
import { splitResourceFields } from "./resourceFields"

/**
 * Lists a resource's plain attributes. Relationships are filtered out: they
 * are rendered by whoever owns that concern, so they don't leak into this list
 * as raw JSON.
 */
export const ResourceAttributes = withSkeletonTemplate<{ resource: Resource }>(
  ({ resource }) => {
    const { attributes } = splitResourceFields(resource)

    return (
      <>
        <Spacer bottom="6">
          <Card gap="none" className="rounded!">
            <ListItem borderStyle="solid" className="flex justify-between px-4">
              <AttributeLabel>ID</AttributeLabel>
              <AttributeValue value={resource.id} />
            </ListItem>
            <ListItem borderStyle="none" className="flex justify-between px-4">
              <AttributeLabel>Type</AttributeLabel>
              <AttributeValue value={resource.type} />
            </ListItem>
          </Card>
        </Spacer>

        <Card gap="none" className="rounded!">
          {attributes.map((attribute, idx) => (
            <AttributeItem
              key={[resource.id, attribute].join("-")}
              attribute={attribute}
              value={resource[attribute as keyof Resource]}
              hasBorderBottom={idx !== attributes.length - 1}
            />
          ))}
        </Card>
      </>
    )
  },
)

function capitalizeAttributeName(attribute: string): string {
  return capitalize(lowerCase(attribute))
}

const AttributeLabel: FC<{
  attribute?: string
  children?: React.ReactNode
}> = ({ attribute, children }) => (
  <Text variant="info" className="whitespace-nowrap">
    {attribute != null ? capitalizeAttributeName(attribute) : children}
  </Text>
)

const AttributeValue: FC<{ value: unknown }> = ({ value }) => {
  if (value == null || value === "") {
    return (
      <Text size="x-small" variant="disabled">
        &#8212;
      </Text>
    )
  }

  return (
    <Text
      size="x-small"
      weight="semibold"
      className="break-all overflow-x-auto tabular-nums font-mono"
    >
      {String(value)}
    </Text>
  )
}

const AttributeItem = withSkeletonTemplate<{
  attribute: string
  value: unknown
  hasBorderBottom: boolean
}>(({ attribute, value, hasBorderBottom }) => {
  const [showJson, setShowJson] = useState(false)
  const isObjectValue = value != null && typeof value === "object"

  return (
    <>
      <ListItem
        borderStyle={hasBorderBottom && !showJson ? "solid" : "none"}
        className="flex justify-between px-4 min-h-13.5"
        alignItems={isObjectValue ? "center" : "top"}
      >
        <AttributeLabel attribute={attribute} />
        {isObjectValue ? (
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
        ) : (
          <AttributeValue value={value} />
        )}
      </ListItem>
      {showJson && isObjectValue && (
        <ListItem
          borderStyle={hasBorderBottom ? "solid" : "none"}
          className="px-4 pt-0"
        >
          <CodeBlock>{value as JsonObject}</CodeBlock>
        </ListItem>
      )}
    </>
  )
})
