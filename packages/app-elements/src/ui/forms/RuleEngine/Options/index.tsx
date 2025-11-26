import { isEqual } from "lodash-es"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import { fetchCoreResourcesSuggestions } from "#ui/forms/CodeEditor/fetchCoreResourcesSuggestions"
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

export function Options({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem | null
  pathPrefix: string
}) {
  if (item == null) {
    return null
  }

  return (
    <>
      <ApplyOnOption item={item} pathPrefix={pathPrefix} />
      <DiscountModeOption item={item} pathPrefix={pathPrefix} />
      <ScopeOption item={item} pathPrefix={pathPrefix} />
      <LimitOption item={item} pathPrefix={pathPrefix} />
      <RoundOption item={item} pathPrefix={pathPrefix} />
    </>
  )
}

function RoundOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "round" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (!(optionName in item) || optionRow == null) {
    return null
  }

  return (
    <optionRow.OptionRow>
      <InputSelect
        name={`${pathPrefix}.${optionName}`}
        isSearchable={false}
        defaultValue={
          typeof item[optionName] === "boolean"
            ? {
                label: item[optionName] ? "Yes" : "No",
                value: item[optionName],
              }
            : undefined
        }
        initialValues={[
          { label: "Yes", value: true },
          { label: "No", value: false },
        ]}
        onSelect={(selected) => {
          if (isSingleValueSelected(selected)) {
            setPath(`${pathPrefix}.${optionName}`, selected.value)
          }
        }}
      />
    </optionRow.OptionRow>
  )
}

function LimitOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "limit" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (!(optionName in item) || optionRow == null) {
    return null
  }

  const mapper = {
    mostExpensive: {
      label: "Most expensive",
      value: {
        attribute: "unit_amount_cents",
        direction: "desc",
      },
    },
    lessExpensive: {
      label: "Less expensive",
      value: {
        attribute: "unit_amount_cents",
        direction: "asc",
      },
    },
  }

  const currentValue = Object.values(mapper).find((entry) =>
    isEqual(item.limit?.sort, entry.value),
  )

  return (
    <optionRow.OptionRow>
      <div className="flex gap-2">
        <Input
          type="number"
          className="basis-32"
          onChange={(e) => {
            const value = parseInt(e.currentTarget.value, 10)
            setPath(`${pathPrefix}.${optionName}.value`, value)
          }}
          defaultValue={item.limit?.value}
        />
        <InputSelect
          className="w-full"
          defaultValue={
            currentValue != null
              ? {
                  label: currentValue.label,
                  value: JSON.stringify(currentValue.value),
                  meta: currentValue.value,
                }
              : {
                  label:
                    item.limit?.sort?.attribute != null &&
                    item.limit?.sort?.direction
                      ? `${item.limit?.sort?.attribute} ${item.limit?.sort?.direction.toUpperCase()}`
                      : "",
                  value: JSON.stringify(item.limit?.sort),
                  meta: item.limit?.sort,
                }
          }
          initialValues={Object.values(mapper).map((entry) => ({
            label: entry.label,
            meta: entry.value,
            value: JSON.stringify(entry.value),
          }))}
          onSelect={(selected) => {
            if (isSingleValueSelected(selected)) {
              setPath(`${pathPrefix}.${optionName}.sort`, selected.meta)
            }
          }}
        />
      </div>
    </optionRow.OptionRow>
  )
}

function DiscountModeOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "discount_mode" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (!(optionName in item) || optionRow == null) {
    return null
  }

  return (
    <optionRow.OptionRow>
      <InputSelect
        initialValues={optionRow.optionConfig?.values ?? []}
        defaultValue={
          item[optionName] != null
            ? {
                label:
                  optionRow.optionConfig?.values?.find(
                    (v) => v.value === item[optionName],
                  )?.label ?? item[optionName],
                value: item[optionName],
              }
            : undefined
        }
        onSelect={(selected) => {
          if (isSingleValueSelected(selected)) {
            setPath(`${pathPrefix}.${optionName}`, selected.value)
          }
        }}
      />
    </optionRow.OptionRow>
  )
}

function ScopeOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "scope" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (!(optionName in item) || optionRow == null) {
    return null
  }

  return (
    <optionRow.OptionRow>
      <InputSelect
        initialValues={optionRow.optionConfig?.values ?? []}
        defaultValue={
          item[optionName] != null
            ? {
                label:
                  optionRow.optionConfig?.values?.find(
                    (v) => v.value === item[optionName],
                  )?.label ?? item[optionName],
                value: item[optionName],
              }
            : undefined
        }
        onSelect={(selected) => {
          if (isSingleValueSelected(selected)) {
            setPath(`${pathPrefix}.${optionName}`, selected.value)
          }
        }}
      />
    </optionRow.OptionRow>
  )
}

function ApplyOnOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "apply_on" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (!(optionName in item) || optionRow == null) {
    return null
  }

  return (
    <optionRow.OptionRow>
      <InputSelect
        initialValues={optionRow.optionConfig?.values ?? []}
        isSearchable={false}
        defaultValue={
          item[optionName] != null
            ? {
                label:
                  optionRow.optionConfig?.values?.find(
                    (v) => v.value === item[optionName],
                  )?.label ?? item[optionName],
                value: item[optionName],
              }
            : undefined
        }
        onSelect={(selected) => {
          if (isSingleValueSelected(selected)) {
            setPath(`${pathPrefix}.${optionName}`, selected.value)
          }
        }}
      />
      {
        // TODO: this will be removed when we have static values for apply_on
        optionRow.optionConfig?.values == null && (
          <InputSelect
            initialValues={optionRow.optionConfig?.values ?? []}
            asTextSearch={true}
            loadAsyncValues={async (inputValue) => {
              const suggestions = (
                await fetchCoreResourcesSuggestions(
                  [optionRow.mainResourceId],
                  `${item.selector}.${inputValue}`,
                )
              )
                .filter(
                  (s) =>
                    s.type === "field" &&
                    s.value.includes(inputValue) &&
                    s.value.endsWith("_cents"),
                )
                .map((suggestion) => {
                  const value = suggestion.value.replace(
                    `${item.selector}.`,
                    "",
                  )

                  return {
                    value,
                    label: value,
                  }
                })

              return suggestions
            }}
            defaultValue={
              item[optionName] != null
                ? {
                    label: item[optionName],
                    value: item[optionName],
                  }
                : undefined
            }
            onSelect={(selected) => {
              if (isSingleValueSelected(selected)) {
                setPath(`${pathPrefix}.${optionName}`, selected.value)
              }
            }}
          />
        )
      }
    </optionRow.OptionRow>
  )
}

function useOptionRow({
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

  if (!(optionName in item) || mainResourceId == null) {
    return null
  }

  const optionConfig =
    "type" in item && item.selector != null
      ? optionsConfig.actions[item.type]?.[
          item.selector as keyof (typeof optionsConfig.actions)[typeof item.type]
        ]?.find((opt) => opt.name === optionName)
      : optionsConfig.conditions.find((opt) => opt.name === optionName)

  // if (optionConfig == null) {
  //   return null
  // }

  return {
    optionConfig,
    mainResourceId,
    OptionRow: ({ children }: { children: React.ReactNode }) => {
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
                />,
              ]}
              dropdownLabel={
                <button type="button">
                  <Text
                    variant="info"
                    size="small"
                    className="flex gap-2 items-center"
                  >
                    {optionConfig?.label ?? OPTION_LABELS[optionName]}
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
  }
}
