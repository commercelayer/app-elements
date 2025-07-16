import { isValid, parseISO } from "date-fns"
import type React from "react"
import { useTokenProvider } from "#providers/TokenProvider"
import { Input } from "#ui/forms/Input"
import { InputDate } from "#ui/forms/InputDate"
import { InputDateRange } from "#ui/forms/InputDateRange"
import {
  InputSelect,
  isMultiValueSelected,
  isSingleValueSelected,
} from "#ui/forms/InputSelect"
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
  const { user } = useTokenProvider()
  const pathKey = `${pathPrefix}.value`

  if (item == null) {
    return null
  }

  if (
    conditionMatchersWithoutValue.includes(
      item.matcher as ConditionMatchersWithoutValue,
    )
  ) {
    return null
  }

  const itemWithValue = item as ItemWithValue

  let fieldType = infos?.field?.type

  if (fieldType == null) {
    fieldType = guessFieldType(itemWithValue.value)
  }

  if (
    (typeof itemWithValue.value === "string" &&
      /^{{.*}}$/.test(itemWithValue.value)) ||
    (Array.isArray(itemWithValue.value) &&
      itemWithValue.value.some(
        (v) => typeof v === "string" && /^{{.*}}$/.test(v),
      ))
  ) {
    fieldType = "string"
  }

  let componentType:
    | "arrayMatch"
    | "boolean"
    | "date"
    | "dateRange"
    | "number"
    | "numberRange"
    | "tag"
    | "text"
    | "textRange"
    | null = null

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

  switch (itemWithValue.matcher) {
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

    default: {
      expectNever(itemWithValue.matcher)
      break
    }
  }

  switch (componentType) {
    case "date": {
      const date = parseISO(
        typeof itemWithValue.value === "string" ? itemWithValue.value : "",
      )

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
      const value = Array.isArray(itemWithValue.value)
        ? (itemWithValue.value.map((v) => {
            const date = parseISO(typeof v === "string" ? v : "")

            return isValid(date) ? date : null
          }) as [Date, Date])
        : ([null, null] as [null, null])

      return (
        <InputDateRange
          value={value}
          showTimeSelect
          onChange={(dates) => {
            setPath(
              `${pathPrefix}.value`,
              dates.map((date) => date?.toJSON() ?? null),
            )
          }}
        />
      )
    }

    case "numberRange": {
      return (
        <InputNumberRange
          value={itemWithValue.value}
          onChange={(value) => {
            setPath(pathKey, value)
          }}
        />
      )
    }

    case "textRange": {
      return (
        <InputTextRange
          value={itemWithValue.value}
          onChange={(value) => {
            setPath(pathKey, value)
          }}
        />
      )
    }

    case "arrayMatch": {
      return (
        <InputArrayMatch
          value={itemWithValue.value}
          pathPrefix={`${pathPrefix}.value`}
        />
      )
    }

    case "tag": {
      return (
        <InputSelect
          isMulti
          isClearable={false}
          isCreatable
          defaultValue={
            Array.isArray(itemWithValue.value)
              ? itemWithValue.value.map((v) => ({
                  label: v.toString(),
                  value: v,
                }))
              : []
          }
          initialValues={[]}
          onSelect={(selected) => {
            if (isMultiValueSelected(selected)) {
              setPath(
                `${pathPrefix}.value`,
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

    case "number": {
      return (
        <Input
          name={`${pathPrefix}.value`}
          type="number"
          defaultValue={
            typeof itemWithValue.value === "number" ? itemWithValue.value : ""
          }
          placeholder="Enter value"
          onChange={(event) => {
            setPath(
              `${pathPrefix}.value`,
              parseInt(event.currentTarget.value, 10),
            )
          }}
        />
      )
    }

    case "boolean": {
      return (
        <InputSelect
          name={`${pathPrefix}.value`}
          defaultValue={
            typeof itemWithValue.value === "boolean"
              ? {
                  label: itemWithValue.value ? "Yes" : "No",
                  value: itemWithValue.value,
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
          name={`${pathPrefix}.value`}
          type="text"
          defaultValue={
            typeof itemWithValue.value === "string"
              ? itemWithValue.value
              : JSON.stringify(itemWithValue.value)
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
