import { useEffect, useState } from "react"
import { atPath } from "#ui/forms/CodeEditor/fetchCoreResourcesSuggestions"
import type { SchemaConditionItem } from "../utils"
import { matcherDictionary } from "./utils"

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

          const selectableResourceIds = ["market", "tag", "sku"]

          setInfos({
            ...result,
            matcherInfos,
            resourceSelectorAvailable:
              result?.resource?.id != null &&
              selectableResourceIds.includes(result.resource.id) &&
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
