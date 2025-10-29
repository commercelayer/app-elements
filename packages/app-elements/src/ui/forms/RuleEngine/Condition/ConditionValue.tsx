import { isValid, parseISO } from "date-fns"
import type React from "react"
import { useEffect, useState } from "react"
import { useTokenProvider } from "#providers/TokenProvider"
import { Text } from "#ui/atoms/Text"
import { Input } from "#ui/forms/Input"
import { InputDate } from "#ui/forms/InputDate"
import { InputDateRange } from "#ui/forms/InputDateRange"
import {
  InputSelect,
  isMultiValueSelected,
  isSingleValueSelected,
} from "#ui/forms/InputSelect"
import { OptionRow } from "../Options/OptionRow"
import { useRuleEngine } from "../RuleEngineContext"
import {
  type ConditionMatchersWithoutValue,
  conditionMatchersWithoutValue,
  expectNever,
  type ItemWithValue,
  type SchemaConditionItem,
} from "../utils"
import { useResourcePathInfos } from "./hooks"
import { guessFieldType } from "./utils"
import { InputArrayMatch } from "./ValueComponents/InputArrayMatch"
import { InputNumberRange } from "./ValueComponents/InputNumberRange"
import { InputResourceSelector } from "./ValueComponents/InputResourceSelector"
import { InputTextRange } from "./ValueComponents/InputTextRange"

/**
 * This function renders the value input for a condition item based on its matcher and its field.
 *
 * > // TODO: **NOTE** the kind of Component depends on the matcher used and the field used. For example, if the matcher is `eq` and the field is `email`, then it should be an email input. Or if the matcher is `gt` and the field is `created_at`, then it should be a date input.
 * > https://docs.commercelayer.io/rules-engine/matchers#value-required
 */
export function ConditionValue({
  item,
  pathPrefix,
}: {
  item: SchemaConditionItem | null
  pathPrefix: string
}): React.ReactNode {
  const { setPath } = useRuleEngine()
  const { infos } = useResourcePathInfos(item)
  const pathKey = `${pathPrefix}.value`
  const [containerKey, forceRerender] = useState<number>(0)
  const [memoMatcher, setMemoMatcher] = useState<
    SchemaConditionItem["matcher"] | undefined
  >(item?.matcher)

  const hasNoValue =
    item == null ||
    conditionMatchersWithoutValue.includes(
      item.matcher as ConditionMatchersWithoutValue,
    )

  let fieldType = infos?.field?.type

  if (itemHasValue(item)) {
    if (fieldType == null) {
      fieldType = guessFieldType(item.value)
    }

    if (
      (typeof item.value === "string" && /^{{.*}}$/.test(item.value)) ||
      (Array.isArray(item.value) &&
        item.value.some((v) => typeof v === "string" && /^{{.*}}$/.test(v)))
    ) {
      // If the value is a template string, treat it as a string
      fieldType = "string"
    }
  }

  const componentType = deriveComponentType(fieldType, item?.matcher, infos)

  useEffect(
    function resetValueWhenComponentTypeChanges() {
      if (memoMatcher !== item?.matcher) {
        setMemoMatcher(item?.matcher)
        if (item?.matcher === "array_match") {
          setPath(pathKey, { in_and: [] })
        } else {
          setPath(pathKey, null)
        }
        forceRerender((k) => k + 1)
      }
    },
    [componentType],
  )

  if (hasNoValue) {
    return null
  }

  const isArrayMatchComponent =
    componentType === "arrayMatch" ||
    (componentType === "resourceSelector" && item?.matcher === "array_match")

  if (isArrayMatchComponent) {
    return (
      <div key={containerKey}>
        <ConditionValueComponent
          item={item}
          fieldType={fieldType}
          componentType={componentType}
          pathKey={pathKey}
        />
      </div>
    )
  }

  return (
    <OptionRow key={containerKey} label={<Text variant="info">Value</Text>}>
      <ConditionValueComponent
        item={item}
        fieldType={fieldType}
        componentType={componentType}
        pathKey={pathKey}
      />
    </OptionRow>
  )
}

function ConditionValueComponent({
  item,
  fieldType,
  componentType,
  pathKey,
}: {
  item: SchemaConditionItem | null
  fieldType: ReturnType<typeof guessFieldType> | undefined
  componentType: ComponentType
  pathKey: string
}): React.ReactNode {
  const { setPath } = useRuleEngine()
  const { user } = useTokenProvider()
  const { infos } = useResourcePathInfos(item)

  const value = itemHasValue(item) ? item.value : undefined

  switch (componentType) {
    case "date": {
      const date = parseISO(typeof value === "string" ? value : "")

      return (
        <InputDate
          value={isValid(date) ? date : undefined}
          showTimeSelect
          placeholder="Enter value"
          onChange={(date) => {
            setPath(pathKey, date?.toJSON())
          }}
          timezone={user?.timezone}
        />
      )
    }

    case "dateRange": {
      const inputValue = Array.isArray(value)
        ? (value.map((v) => {
            const date = parseISO(typeof v === "string" ? v : "")

            return isValid(date) ? date : null
          }) as [Date, Date])
        : ([null, null] as [null, null])

      return (
        <InputDateRange
          value={inputValue}
          showTimeSelect
          onChange={(dates) => {
            setPath(
              pathKey,
              dates.map((date) => date?.toJSON() ?? null),
            )
          }}
        />
      )
    }

    case "numberRange": {
      return (
        <InputNumberRange
          value={value}
          onChange={(value) => {
            setPath(pathKey, value)
          }}
        />
      )
    }

    case "textRange": {
      return (
        <InputTextRange
          value={value}
          onChange={(value) => {
            setPath(pathKey, value)
          }}
        />
      )
    }

    case "arrayMatch": {
      return (
        <InputArrayMatch infos={infos} value={value} pathPrefix={pathKey} />
      )
    }

    case "tag": {
      return (
        <InputSelect
          isMulti
          isClearable={false}
          isCreatable
          defaultValue={
            Array.isArray(value)
              ? value.map((v) => ({
                  label: v.toString(),
                  value: v,
                }))
              : []
          }
          initialValues={[]}
          onSelect={(selected) => {
            if (isMultiValueSelected(selected)) {
              setPath(
                pathKey,
                selected
                  .map((s) => {
                    if (fieldType === "integer") {
                      const intValue = parseInt(s.value.toString(), 10)
                      if (Number.isNaN(intValue)) {
                        return null
                      }
                      return intValue
                    }

                    return s.value
                  })
                  .filter((s) => s != null),
              )
            }
          }}
        />
      )
    }

    case "resourceSelector": {
      if (item?.matcher === "array_match") {
        return (
          <InputArrayMatch
            infos={infos}
            value={value}
            pathPrefix={pathKey}
            hasResourceSelector
          />
        )
      }

      return (
        <InputResourceSelector infos={infos} value={value} pathKey={pathKey} />
      )
    }

    case "number": {
      return (
        <Input
          name={pathKey}
          type="number"
          defaultValue={typeof value === "number" ? value : ""}
          placeholder="Enter value"
          onChange={(event) => {
            setPath(pathKey, parseInt(event.currentTarget.value, 10))
          }}
        />
      )
    }

    case "boolean": {
      return (
        <InputSelect
          name={pathKey}
          defaultValue={
            typeof value === "boolean"
              ? {
                  label: value ? "Yes" : "No",
                  value: value,
                }
              : undefined
          }
          initialValues={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          onSelect={(selected) => {
            if (isSingleValueSelected(selected)) {
              setPath(pathKey, selected.value)
            }
          }}
        />
      )
    }

    case "text":
    case null: {
      return (
        <Input
          name={pathKey}
          type="text"
          defaultValue={
            typeof value === "string" ? value : JSON.stringify(value)
          }
          placeholder="Enter value"
          onChange={(event) => {
            setPath(pathKey, event.currentTarget.value)
          }}
        />
      )
    }

    default: {
      return expectNever(componentType)
    }
  }
}

function itemHasValue(item: SchemaConditionItem | null): item is ItemWithValue {
  return item != null && "value" in item
}

type ComponentType =
  | "arrayMatch"
  | "boolean"
  | "date"
  | "dateRange"
  | "number"
  | "numberRange"
  | "tag"
  | "text"
  | "textRange"
  | "resourceSelector"
  | null

function deriveComponentType(
  fieldType: string | undefined,
  matcher: SchemaConditionItem["matcher"] | undefined,
  infos: ReturnType<typeof useResourcePathInfos>["infos"],
): ComponentType {
  let componentType: ComponentType = null

  // choose a componentType given the "fieldType"
  switch (fieldType) {
    case "datetime": {
      componentType = "date"
      break
    }

    case "boolean": {
      componentType = "boolean"
      break
    }

    case "string": {
      componentType = "text"
      break
    }

    case "integer":
    case "float": {
      componentType = "number"
      break
    }

    case "array":
    case "json":
    case "object": {
      break
    }

    default: {
      componentType = "text"
      break
    }
  }

  // choose a componentType given the "matcher"
  switch (matcher) {
    case "eq":
    case "not_eq":
    case "lt":
    case "lteq":
    case "gt":
    case "gteq":
    case "multiple":
    case "start_with":
    case "not_start_with":
    case "end_with":
    case "not_end_with": {
      // pass through to the default case
      break
    }

    case "matches":
    case "does_not_match": {
      // need to handle regex input
      break
    }

    case "gt_lt":
    case "gteq_lt":
    case "gt_lteq":
    case "gteq_lteq": {
      // these matchers expect an array of two values (only for date and number)
      if (componentType === "number") {
        componentType = "numberRange"
      }

      if (componentType === "text") {
        componentType = "textRange"
      }

      if (componentType === "date") {
        componentType = "dateRange"
      }

      break
    }

    case "is_in":
    case "is_not_in": {
      // these matchers expect an array of values
      componentType = "tag"
      break
    }

    case "array_match": {
      // this matcher expects an object with conditions
      componentType = "arrayMatch"
      break
    }

    case null:
    case undefined:
    case "blank":
    case "not_null":
    case "null":
    case "present": {
      // do nothing since there's no value
      break
    }

    default: {
      expectNever(matcher)
      break
    }
  }

  if (infos?.resourceSelectorAvailable) {
    componentType = "resourceSelector"
  }

  return componentType
}
