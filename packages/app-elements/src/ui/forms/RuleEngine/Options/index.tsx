import { isEqual } from "lodash-es"
import { useCallback, useState } from "react"
import { Button } from "#ui/atoms/Button"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"
import { Input } from "#ui/forms/Input"
import {
  InputSelect,
  isMultiValueSelected,
  isSingleValueSelected,
} from "#ui/forms/InputSelect"
import { useAvailableGroups } from "../Condition/hooks"
import { InputResourceSelector } from "../InputResourceSelector"
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
      <GroupOption item={item} pathPrefix={pathPrefix} />
      <IdentifiersOption item={item} pathPrefix={pathPrefix} />
      <QuantityOption item={item} pathPrefix={pathPrefix} />
      <ApplyOnOption item={item} pathPrefix={pathPrefix} />
      <DiscountModeOption item={item} pathPrefix={pathPrefix} />
      <AggregationOption item={item} pathPrefix={pathPrefix} />
      <AggregationsOption item={item} pathPrefix={pathPrefix} />
      <LimitOption item={item} pathPrefix={pathPrefix} />
      <BundleOption item={item} pathPrefix={pathPrefix} />
      <RoundOption item={item} pathPrefix={pathPrefix} />
      <ScopeOption item={item} pathPrefix={pathPrefix} />
    </>
  )
}

function GroupOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "group" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  const availableGroups = useAvailableGroups()

  if (!(optionName in item) || optionRow == null || item.group === undefined) {
    return null
  }

  return (
    <optionRow.OptionRow>
      <InputSelect
        name={`${pathPrefix}.group`}
        isCreatable
        initialValues={availableGroups.map((group) => ({
          value: group,
          label: group,
        }))}
        defaultValue={
          item.group != null
            ? {
                value: item.group,
                label: item.group,
              }
            : undefined
        }
        onSelect={(selected) => {
          if (selected == null || isSingleValueSelected(selected)) {
            setPath(`${pathPrefix}.group`, selected?.value.toString())
          }
        }}
        placeholder="Select or create group…"
      />
    </optionRow.OptionRow>
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

  const initialValues = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ]

  const defaultValue = initialValues.find((v) => v.value === item[optionName])

  return (
    <optionRow.OptionRow>
      <InputSelect
        name={`${pathPrefix}.${optionName}`}
        isSearchable={false}
        defaultValue={defaultValue}
        initialValues={initialValues}
        onSelect={(selected) => {
          if (isSingleValueSelected(selected)) {
            setPath(`${pathPrefix}.${optionName}`, selected.value)
          }
        }}
      />
    </optionRow.OptionRow>
  )
}

function QuantityOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "quantity" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (!(optionName in item) || optionRow == null) {
    return null
  }

  const defaultValue = item[optionName]

  return (
    <optionRow.OptionRow>
      <Input
        type="number"
        name={`${pathPrefix}.${optionName}`}
        defaultValue={defaultValue}
        min={1}
        onChange={(e) => {
          const value = parseInt(e.currentTarget.value, 10)
          setPath(`${pathPrefix}.${optionName}`, value)
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

  const defaultValue = optionRow.optionConfig?.values?.find((entry) =>
    isEqual(item.limit?.sort, entry.meta),
  )

  return (
    <optionRow.OptionRow>
      <div className="flex gap-2">
        <Input
          type="number"
          className="basis-20"
          placeholder="1"
          onChange={(e) => {
            const value = parseInt(e.currentTarget.value, 10)
            setPath(`${pathPrefix}.${optionName}.value`, value)
          }}
          defaultValue={item.limit?.value}
        />
        <InputSelect
          className="grow"
          defaultValue={
            defaultValue != null
              ? defaultValue
              : item.limit?.sort == null
                ? undefined
                : {
                    label:
                      item.limit.sort.attribute != null &&
                      item.limit.sort.direction
                        ? `${item.limit.sort.attribute} ${item.limit.sort.direction.toUpperCase()}`
                        : "",
                    value: JSON.stringify(item.limit.sort),
                    meta: item.limit.sort,
                  }
          }
          initialValues={
            optionRow.optionConfig?.values?.map((entry) => ({
              label: entry.label,
              meta: entry.meta,
              value: JSON.stringify(entry.meta),
            })) ?? []
          }
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

function AggregationOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "aggregation" as const

  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (!(optionName in item) || optionRow == null || item[optionName] == null) {
    return null
  }

  return (
    <optionRow.OptionRow>
      <AggregationRow
        aggregation={item[optionName]}
        optionConfig={optionRow.optionConfig}
        pathPrefix={`${pathPrefix}.${optionName}`}
      />
    </optionRow.OptionRow>
  )
}

function AggregationRow({
  aggregation,
  pathPrefix,
  optionConfig,
}: {
  aggregation:
    | NonNullable<SchemaActionItem["aggregation"]>
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

function AggregationsOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "aggregations" as const

  const { setPath } = useRuleEngine()
  const [rerenderKey, setRerenderKey] = useState(0)
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (
    !(optionName in item) ||
    optionRow == null ||
    item[optionName] == null ||
    item[optionName].length === 0
  ) {
    return null
  }

  return (
    <optionRow.OptionRow key={rerenderKey}>
      {item.aggregations?.map((aggregation, index) => {
        const key = index.toString()
        return (
          <div key={key} className="flex justify-between gap-2">
            <AggregationRow
              aggregation={aggregation}
              optionConfig={optionRow.optionConfig}
              pathPrefix={`${pathPrefix}.${optionName}.${index}`}
            />
            <Dropdown
              className="grow-0"
              dropdownLabel={
                <Button variant="input" className="h-11 bg-gray-50">
                  <Icon name="dotsThreeVertical" size={16} weight="bold" />
                </Button>
              }
              dropdownItems={[
                <DropdownItem
                  label="Add aggregation"
                  key={`${key}-"add-aggregation"`}
                  onClick={() => {
                    setPath(
                      `${pathPrefix}.aggregations.${item.aggregations?.length}`,
                      {},
                    )
                  }}
                />,
                <DropdownItem
                  label="Duplicate"
                  key={`${key}-"duplicate"`}
                  onClick={() => {
                    setPath(
                      `${pathPrefix}.aggregations.${item.aggregations?.length}`,
                      aggregation,
                    )
                  }}
                />,
                <DropdownDivider key={`${key}-"divider"`} />,
                <DropdownItem
                  label="Remove"
                  disabled={item.aggregations?.length === 1}
                  key={`${key}-"remove-aggregation"`}
                  onClick={() => {
                    if (item.aggregations?.length === 1) {
                      setPath(`${pathPrefix}.aggregations`, null)
                    } else {
                      setPath(`${pathPrefix}.aggregations.${index}`, null)
                    }
                    setRerenderKey((prev) => prev + 1)
                  }}
                />,
              ]}
            />
          </div>
        )
      })}
    </optionRow.OptionRow>
  )
}

function BundleOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "bundle" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (!(optionName in item) || optionRow == null) {
    return null
  }

  const defaultValue = optionRow.optionConfig?.values?.find((entry) =>
    isEqual(item.bundle?.sort, entry.meta),
  )

  const bundleTypes = [
    { label: "Balanced", value: "balanced" },
    { label: "Every", value: "every" },
  ]

  return (
    <optionRow.OptionRow>
      <div className="flex gap-2">
        <InputSelect
          initialValues={bundleTypes}
          defaultValue={
            item.bundle?.type == null
              ? undefined
              : (bundleTypes.find((v) => v.value === item.bundle?.type) ?? {
                  label: item.bundle.type,
                  value: item.bundle.type,
                })
          }
          onSelect={(selected) => {
            if (isSingleValueSelected(selected)) {
              setPath(`${pathPrefix}.${optionName}.type`, selected.value)

              if (selected.value === "balanced") {
                setPath(`${pathPrefix}.${optionName}.value`, null)
              }
            }
          }}
        />
        {item.bundle?.type === "every" && (
          <Input
            type="number"
            className="basis-20"
            placeholder="1"
            onChange={(e) => {
              const value = parseInt(e.currentTarget.value, 10)
              setPath(`${pathPrefix}.${optionName}.value`, value)
            }}
            defaultValue={item.bundle?.value}
          />
        )}
        <InputSelect
          className="grow"
          defaultValue={
            defaultValue != null
              ? defaultValue
              : item.bundle?.sort == null
                ? undefined
                : {
                    label:
                      item.bundle.sort.attribute != null &&
                      item.bundle.sort.direction
                        ? `${item.bundle.sort.attribute} ${item.bundle.sort.direction.toUpperCase()}`
                        : "",
                    value: JSON.stringify(item.bundle.sort),
                    meta: item.bundle?.sort,
                  }
          }
          initialValues={
            optionRow.optionConfig?.values?.map((entry) => ({
              label: entry.label,
              meta: entry.meta,
              value: JSON.stringify(entry.meta),
            })) ?? []
          }
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
          item[optionName] != null && item[optionName] !== ""
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
      {/* {
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
      } */}
    </optionRow.OptionRow>
  )
}

function IdentifiersOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem
  pathPrefix: string
}) {
  const optionName = "identifiers" as const

  const { setPath } = useRuleEngine()
  const [rerenderKey, setRerenderKey] = useState(0)
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (optionRow == null || optionRow.optionConfig?.required !== true) {
    return null
  }

  const identifiers = optionName in item ? item.identifiers : {}
  const identifierEntries = Object.entries(identifiers)

  return (
    <optionRow.OptionRow key={rerenderKey}>
      {identifierEntries?.map(([identifierKey, identifierValue]) => {
        const resourceType =
          identifierKey === "order.line_items.sku.id"
            ? "skus"
            : identifierKey === "order.line_items.bundle.id"
              ? "bundles"
              : identifierKey === "order.line_items.sku.sku_lists.id"
                ? "sku_lists"
                : undefined

        const allValues = optionRow.optionConfig?.values ?? []
        const filteredValues = allValues.filter(({ value }) => {
          return identifierEntries.find(([key]) => key === value) == null
        })
        const selectedValue = {
          label:
            allValues.find((v) => v.value === identifierKey)?.label ??
            identifierKey,
          value: identifierKey,
        }

        return (
          <div key={identifierKey} className="flex justify-between gap-2">
            <InputSelect
              initialValues={
                identifierKey === "" ? filteredValues : [selectedValue]
              }
              isSearchable={false}
              defaultValue={{
                label:
                  allValues.find((v) => v.value === identifierKey)?.label ??
                  identifierKey,
                value: identifierKey,
              }}
              onSelect={(selected) => {
                if (
                  isSingleValueSelected(selected) &&
                  typeof selected.value === "string" &&
                  identifierKey !== selected.value
                ) {
                  delete identifiers[identifierKey]
                  setPath(`${pathPrefix}.${optionName}`, {
                    ...identifiers,
                    [selected.value]: identifierValue,
                  })
                }
              }}
            />
            <div className="flex-1">
              <InputResourceSelector
                resource={resourceType ?? "skus"}
                resourceKey="id"
                isDisabled={resourceType == null}
                isMulti
                value={identifierValue}
                onSelect={(selected) => {
                  if (isMultiValueSelected(selected)) {
                    setPath(`${pathPrefix}.${optionName}`, {
                      ...identifiers,
                      [identifierKey]: selected
                        .map((s) => s.value)
                        .filter((s) => s != null),
                    })
                  }
                }}
              />
            </div>
            <Dropdown
              className="grow-0"
              dropdownLabel={
                <Button variant="input" className="h-11 bg-gray-50">
                  <Icon name="dotsThreeVertical" size={16} weight="bold" />
                </Button>
              }
              dropdownItems={[
                <DropdownItem
                  label="Add identifier"
                  disabled={
                    identifierEntries?.length ===
                    optionRow.optionConfig?.values?.length
                  }
                  key={`${identifierKey}-"add-identifier"`}
                  onClick={() => {
                    setPath(`${pathPrefix}.identifiers`, {
                      ...identifiers,
                      "": [],
                    })
                  }}
                />,
                <DropdownDivider key={`${identifierKey}-"divider"`} />,
                <DropdownItem
                  label="Remove"
                  disabled={identifierEntries?.length === 1}
                  key={`${identifierKey}-"remove-identifier"`}
                  onClick={() => {
                    if (identifierEntries?.length > 1) {
                      setPath(
                        `${pathPrefix}.identifiers`,
                        Object.fromEntries(
                          identifierEntries.filter(
                            ([key]) => key !== identifierKey,
                          ),
                        ),
                      )
                    }
                    setRerenderKey((prev) => prev + 1)
                  }}
                />,
              ]}
            />
          </div>
        )
      })}
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

  const optionConfig =
    "type" in item && item.selector != null
      ? optionsConfig.actions[item.type]?.[
          item.selector as keyof (typeof optionsConfig.actions)[typeof item.type]
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

  if (!(optionName in item) || mainResourceId == null) {
    return null
  }

  return {
    optionConfig,
    mainResourceId,
    OptionRow: CustomizedOptionRow,
  }
}
