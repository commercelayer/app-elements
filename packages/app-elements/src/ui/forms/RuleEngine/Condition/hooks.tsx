import type { ResourceTypeLock } from "@commercelayer/sdk"
import { compact, uniq } from "lodash-es"
import { useEffect, useState } from "react"
import { atPath } from "#ui/forms/CodeEditor/fetchCoreResourcesSuggestions"
import { useRuleEngine } from "../RuleEngineContext"
import type { Conditions } from "../schema.order_rules"
import type { SchemaConditionItem } from "../utils"
import { matcherDictionary } from "./utils"

const selectableResources = {
  market: "markets",
  tag: "tags",
  sku: "skus",
  sku_list: "sku_lists",
} as const satisfies Record<string, ResourceTypeLock>

export function getResourceType(resourceId: string | undefined) {
  return selectableResources[resourceId as keyof typeof selectableResources]
}

export function useResourcePathInfos(item: SchemaConditionItem | null): {
  infos:
    | (Awaited<ReturnType<typeof atPath>> & {
        /** Information about the matcher used in the condition. */
        matcherInfos: (typeof matcherDictionary)[number] | undefined
        /** When `true`, the ResourceSelector can be used as a value component. */
        resourceSelectorAvailable: boolean
      })
    | undefined
} {
  const [infos, setInfos] =
    useState<ReturnType<typeof useResourcePathInfos>["infos"]>(undefined)

  useEffect(() => {
    if (item?.field != null) {
      atPath(item.field)
        .then((result) => {
          const matcherInfos = matcherDictionary.find(
            (dict) => dict.matcher === item.matcher,
          )

          setInfos({
            ...result,
            matcherInfos,
            resourceSelectorAvailable:
              result?.resource?.id != null &&
              Object.keys(selectableResources).includes(result.resource.id) &&
              result.path.endsWith(".id") &&
              matcherInfos?.exactMatch === true,
          })
        })
        .catch((error) => {
          console.error("Error fetching field info:", error)
        })
    }
  }, [item?.field, item?.matcher])

  return { infos }
}

function extractAvailableGroups(conditions: Conditions | undefined): string[] {
  if (conditions == null || conditions.length === 0) {
    return []
  }
  return uniq(
    compact(
      conditions.flatMap((condition) => [
        condition?.group,
        ...extractAvailableGroups(condition?.nested?.conditions),
      ]),
    ),
  )
}

/**
 * Extracts the available groups for the current rule.
 * @returns The available groups for the current rule.
 */
export function useAvailableGroups(): string[] {
  const {
    state: { selectedRuleIndex, value },
  } = useRuleEngine()

  const availableGroups = extractAvailableGroups(
    value.rules?.[selectedRuleIndex]?.conditions,
  )

  return availableGroups
}
