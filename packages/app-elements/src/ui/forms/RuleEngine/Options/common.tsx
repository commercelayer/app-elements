import { isEqual } from "lodash-es"
import { useCallback } from "react"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import { Input } from "#ui/forms/Input"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
import { OptionRow } from "../layout/OptionRow"
import {
  type ManagedActionOption,
  type ManagedConditionOption,
  OPTION_LABELS,
  type OptionConfig,
} from "../optionsConfig"
import { useRuleEngine } from "../RuleEngineContext"
import type { SchemaActionItem, SchemaConditionItem } from "../utils"

export function useOptionRow({
  item,
  optionName,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  optionName: ManagedActionOption | ManagedConditionOption
  pathPrefix: string
}): {
  optionConfig?: OptionConfig
  mainResourceId: "price" | "order"
  OptionRow: React.FC<{ children: React.ReactNode }>
} | null {
  const { setPath, optionsConfig, schemaType } = useRuleEngine()

  const mainResourceId =
    schemaType === "order-rules"
      ? "order"
      : schemaType === "price-rules"
        ? "price"
        : undefined

  const selector = item != null && "selector" in item ? item.selector : ""

  const optionConfig =
    "type" in item
      ? optionsConfig.actions[item.type]?.[
          selector as keyof (typeof optionsConfig.actions)[typeof item.type]
        ]?.find((opt) => opt.name === optionName)
      : optionsConfig.conditions.find((opt) => opt.name === optionName)

  const CustomizedOptionRow = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      const label = optionConfig?.label ?? OPTION_LABELS[optionName]
      const required = optionConfig?.required === true

      if (required) {
        return (
          <OptionRow
            label={
              <Text
                variant="info"
                size="small"
                className="flex gap-2 items-center"
              >
                {label}
              </Text>
            }
          >
            {children}
          </OptionRow>
        )
      }

      return (
        <OptionRow
          label={
            <Dropdown
              className="inline-flex"
              menuPosition="bottom-left"
              dropdownItems={[
                <DropdownItem
                  key="remove"
                  onClick={() => {
                    setPath(`${pathPrefix}.${optionName}`, null)
                  }}
                  label="Remove"
                  disabled={optionConfig?.required === true}
                />,
              ]}
              dropdownLabel={
                <button type="button">
                  <Text
                    variant="info"
                    size="small"
                    className="flex gap-2 items-center"
                  >
                    {label}
                    <Icon name="caretDown" />
                  </Text>
                </button>
              }
            />
          }
        >
          {children}
        </OptionRow>
      )
    },
    [pathPrefix, optionName, optionConfig, setPath],
  )

  if (
    (!(optionName in item) && optionConfig == null) ||
    // (!(optionName in item) && optionConfig?.required === false) ||
    mainResourceId == null
  ) {
    return null
  }

  return {
    optionConfig,
    mainResourceId,
    OptionRow: CustomizedOptionRow,
  }
}

export function AggregationRow({
  aggregation,
  pathPrefix,
  optionConfig,
}: {
  aggregation:
    | NonNullable<
        Extract<SchemaActionItem, { aggregation: unknown }>["aggregation"]
      >
    | NonNullable<SchemaConditionItem["aggregations"]>[number]
  pathPrefix: string
  optionConfig?: OptionConfig
}) {
  const { setPath } = useRuleEngine()

  const defaultValue = optionConfig?.values?.find(
    (entry) =>
      isEqual(aggregation.field, entry.meta?.field) &&
      isEqual(aggregation.operator, entry.meta?.operator),
  )

  const matchers = [
    { label: "=", value: "eq" },
    { label: ">", value: "gt" },
    { label: "<", value: "lt" },
    { label: ">=", value: "gteq" },
    { label: "<=", value: "lteq" },
    { label: "≠", value: "not_eq" },
    { label: "multiple", value: "multiple" },
  ]

  return (
    <div className="flex gap-2 grow">
      <InputSelect
        className="grow"
        defaultValue={
          defaultValue != null
            ? defaultValue
            : aggregation.field == null || aggregation.operator == null
              ? undefined
              : {
                  label: `${aggregation.field} ${aggregation.operator.toUpperCase()}`,
                  value: JSON.stringify({
                    field: aggregation.field,
                    operation: aggregation.operator,
                  }),
                  meta: {
                    field: aggregation.field,
                    operation: aggregation.operator,
                  },
                }
        }
        initialValues={
          optionConfig?.values?.map((entry) => ({
            label: entry.label,
            meta: entry.meta,
            value: JSON.stringify(entry.meta),
          })) ?? []
        }
        onSelect={(selected) => {
          if (isSingleValueSelected(selected)) {
            setPath(`${pathPrefix}.field`, selected.meta?.field)
            setPath(`${pathPrefix}.operator`, selected.meta?.operator)
          }
        }}
      />
      <InputSelect
        className="w-34"
        defaultValue={
          aggregation.matcher != null
            ? {
                label:
                  matchers.find((v) => v.value === aggregation.matcher)
                    ?.label ?? aggregation.matcher,
                value: aggregation.matcher,
              }
            : undefined
        }
        initialValues={matchers}
        onSelect={(selected) => {
          if (isSingleValueSelected(selected)) {
            setPath(`${pathPrefix}.matcher`, selected.value)
          }
        }}
      />
      <Input
        type="number"
        className="basis-20"
        placeholder="0"
        onChange={(e) => {
          const value = parseInt(e.currentTarget.value, 10)
          setPath(`${pathPrefix}.value`, value)
        }}
        defaultValue={aggregation.value}
      />
    </div>
  )
}
