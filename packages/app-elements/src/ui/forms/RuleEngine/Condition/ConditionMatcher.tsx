import type React from "react"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
import { useRuleEngine } from "../RuleEngineContext"
import {
  type ConditionMatchersWithoutValue,
  conditionMatchersWithoutValue,
  type ItemWithValue,
  type SchemaConditionItem,
} from "../utils"
import { useResourcePathInfos } from "./hooks"
import { guessFieldType, matcherDictionary } from "./utils"

export function ConditionMatcher({
  item,
  pathPrefix,
}: {
  item: SchemaConditionItem | null
  pathPrefix: string
}): React.ReactNode {
  const { setPath } = useRuleEngine()
  const { infos } = useResourcePathInfos(item)

  let fieldType = infos?.field?.type

  if (fieldType == null) {
    fieldType = guessFieldType((item as ItemWithValue | null)?.value)
  }

  const resourceId = infos?.resource?.id

  const AGGREGATED_RESOURCE = ["tag"]
  const AGGREGATED_RESOURCE_MATCHERS = [
    "matches",
    "does_not_match",
    "array_match",
  ]

  const initialValues = matcherDictionary
    .filter(({ fieldTypes, visible }) => {
      return visible !== false && fieldTypes.includes(fieldType)
    })
    .filter(({ matcher }) => {
      return (
        resourceId == null ||
        (resourceId != null && !AGGREGATED_RESOURCE.includes(resourceId)) ||
        AGGREGATED_RESOURCE_MATCHERS.includes(matcher)
      )
    })
    .map(({ matcher, label }) => ({ value: matcher, label }))

  return (
    <InputSelect
      className="min-w-[175px]"
      name={`${pathPrefix}.matcher`}
      value={
        item != null && item.matcher != null
          ? (initialValues.find((v) => v.value === item.matcher) ?? {
              label: item.matcher != null ? `⚠️   ${item.matcher}` : "",
              value: item.matcher,
            })
          : undefined
      }
      initialValues={initialValues}
      onSelect={(selected) => {
        if (isSingleValueSelected(selected)) {
          setPath(`${pathPrefix}.matcher`, selected.value)

          if (
            conditionMatchersWithoutValue.includes(
              selected.value as ConditionMatchersWithoutValue,
            )
          ) {
            setPath(`${pathPrefix}.value`, null)
          }
        }
      }}
    />
  )
}
