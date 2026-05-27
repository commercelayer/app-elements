import type { Order } from "@commercelayer/sdk"
import capitalize from "lodash-es/capitalize"
import lowerCase from "lodash-es/lowerCase"
import { type FC, useState } from "react"
import type { JsonObject } from "type-fest"
import { useCoreApi } from "#providers/CoreSdkProvider"
import { Button } from "#ui/atoms/Button"
import { Card } from "#ui/atoms/Card"
import { CodeBlock } from "#ui/atoms/CodeBlock"
import { Icon } from "#ui/atoms/Icon"
import {
  SkeletonTemplate,
  withSkeletonTemplate,
} from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { ListItem } from "#ui/composite/ListItem"
import type { UseResourceModalConfig } from "./useResourceModal"

type Props = Pick<UseResourceModalConfig, "resourceType" | "resourceId">

export const ResourceAttributes: FC<Props> = ({ resourceType, resourceId }) => {
  const {
    data: resourceData,
    isLoading,
    error,
  } = useCoreApi(
    resourceType,
    "retrieve",
    resourceId != null ? [resourceId] : null,
    {
      fallbackData: mockedResource,
    },
  )

  const { id, type, ...rest } = resourceData ?? {}
  const attributes = Object.keys(rest)

  return error ? (
    <Spacer top="4">
      <Text variant="info" align="center">
        Resource not found.
      </Text>
    </Spacer>
  ) : (
    <SkeletonTemplate isLoading={isLoading || resourceData == null}>
      <Spacer bottom="6" top="4">
        <Card gap="none" className="rounded!">
          <ListItem borderStyle="solid" className="flex justify-between px-4">
            <Text variant="info">ID</Text>
            <Text weight="medium" className="font-mono">
              {id}
            </Text>
          </ListItem>
          <ListItem borderStyle="none" className="flex justify-between px-4">
            <Text variant="info">Type</Text>
            <Text weight="medium" className="font-mono">
              {type}
            </Text>
          </ListItem>
        </Card>
      </Spacer>
      <div className="pb-6">
        <Card gap="none" className="rounded!">
          {attributes.map((attribute, idx) => {
            return (
              <ResourceAttributeItem
                key={["attributes", resourceData?.id, attribute].join("-")}
                attribute={attribute}
                value={resourceData?.[attribute as keyof typeof resourceData]}
                hasBorderBottom={idx !== attributes.length - 1}
              />
            )
          })}
        </Card>
      </div>
    </SkeletonTemplate>
  )
}

/**
 * Mocked resource used as fallback data while the actual resource is being fetched.
 */
const mockedResource = {
  id: "fake-resource-id",
  type: "orders",
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-01T00:00:00.000Z",
  reference: "FAKE-REF-1234",
  metadata: {
    source: "mock",
  },
} as unknown as Order

const ResourceAttributeItem = withSkeletonTemplate<{
  attribute: unknown
  value: unknown
  hasBorderBottom: boolean
}>(({ attribute, value, hasBorderBottom }) => {
  /**
   * State to manage the content and the visibility of the code block used to expand
   * the attribute row when its value is an object.
   * This state is toggled when the Json button is clicked.
   */
  const [codeBlockContent, setCodeBlockContent] = useState<
    string | JsonObject | null
  >(null)

  /**
   * Component to render the value of an attribute.
   * If the value is an object, a button is rendered to toggle the visibility of a
   * code block that shows the JSON representation of the value.
   * If the value is a primitive, it is rendered as text.
   * If the value is null or an empty string, a dash is rendered.
   * The code block content and visibility are managed by the `codeBlockContent` state.
   */
  const AttributeValue = withSkeletonTemplate<{
    value: unknown
  }>(({ value }) => {
    if (value == null || value === "") {
      return <Text variant="disabled">&#8212;</Text>
    }

    if (typeof value === "object") {
      return (
        <Button
          variant="secondary"
          disabled={Object.keys(value as JsonObject).length === 0}
          size="mini"
          onClick={() => {
            if (codeBlockContent != null) {
              setCodeBlockContent(null)
            } else {
              setCodeBlockContent(value as JsonObject)
            }
          }}
        >
          <Icon name="bracketsCurly" size={14} />
          <Text weight="medium" size="x-small">
            Json
          </Text>
        </Button>
      )
    } else {
      return (
        <Text
          weight="medium"
          className="break-all whitespace-pre overflow-x-auto tabular-nums font-mono"
        >
          {value.toString()}
        </Text>
      )
    }
  })

  return (
    <>
      <ListItem
        borderStyle={
          hasBorderBottom && codeBlockContent == null ? "solid" : "none"
        }
        className="flex justify-between px-4 h-13.5"
      >
        <Text variant="info">
          {capitalize(lowerCase(attribute?.toString() ?? ""))}
        </Text>
        <AttributeValue value={value} />
      </ListItem>
      {codeBlockContent != null && (
        <ListItem
          borderStyle={hasBorderBottom ? "solid" : "none"}
          className="px-4 pt-0"
        >
          <CodeBlock>{codeBlockContent}</CodeBlock>
        </ListItem>
      )}
    </>
  )
})
