import { isEqual } from "lodash-es"
import { useTranslation } from "react-i18next"
import { Text } from "#ui/atoms/Text"
import { Input } from "#ui/forms/Input"
import {
  InputSelect,
  isMultiValueSelected,
  isSingleValueSelected,
} from "#ui/forms/InputSelect"
import { useAvailableGroups } from "../Condition/hooks"
import { InputResourceSelector } from "../InputResourceSelector"
import { OptionRow } from "../layout/OptionRow"
import type { RuleEngineProps } from "../RuleEngineComponent"
import { useRuleEngine } from "../RuleEngineContext"
import type { SchemaActionItem } from "../utils"
import { AggregationRow, useOptionRow } from "./common"

export function ActionOptions({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | null
  pathPrefix: string
}) {
  if (item == null) {
    return null
  }

  return (
    <>
      <SelectorOption item={item} pathPrefix={pathPrefix} />
      <GroupsOption item={item} pathPrefix={pathPrefix} />
      <IdentifiersOption item={item} pathPrefix={pathPrefix} />
      <QuantityOption item={item} pathPrefix={pathPrefix} />
      <ApplyOnOption item={item} pathPrefix={pathPrefix} />
      <DiscountModeOption item={item} pathPrefix={pathPrefix} />
      <AggregationOption item={item} pathPrefix={pathPrefix} />
      <LimitOption item={item} pathPrefix={pathPrefix} />
      <BundleOption item={item} pathPrefix={pathPrefix} />
      <RoundOption item={item} pathPrefix={pathPrefix} />
    </>
  )
}

function SelectorOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem
  pathPrefix: string
}) {
  const optionName = "selector" as const

  const { setPath, schemaType } = useRuleEngine()
  const { t } = useTranslation()

  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (!(optionName in item) || optionRow == null) {
    return null
  }

  const initialValues = actionPaths[schemaType].map((field) => ({
    value: field,
    label: (t(`resource_paths.${field}`) as string).replace(
      "resource_paths.",
      "",
    ),
  }))

  const name = `${pathPrefix}.${optionName}`

  const value =
    optionName in item
      ? item?.selector == null
        ? undefined
        : (initialValues.find((c) => c.value === item.selector) ?? {
            value: item.selector,
            label: item.selector,
          })
      : undefined

  return (
    <optionRow.OptionRow>
      <InputSelect
        name={name}
        isSearchable={false}
        initialValues={initialValues}
        value={value}
        onSelect={async (selection) => {
          if (isSingleValueSelected(selection)) {
            setPath(name, selection.value)
            setPath(`${pathPrefix}.apply_on`, null)
          }
        }}
      />
    </optionRow.OptionRow>
  )
}

function GroupsOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem
  pathPrefix: string
}) {
  const optionName = "groups" as const

  const { setPath, schemaType } = useRuleEngine()
  const availableGroups = useAvailableGroups()

  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (!(optionName in item) || optionRow == null) {
    return null
  }

  if (
    availableGroups.length <= 0 &&
    ("groups" in item && item.groups != null ? item.groups : []).length <= 0
  ) {
    return null
  }

  const value =
    "groups" in item
      ? item != null
        ? item.groups?.map((groups) => ({
            label: availableGroups.includes(groups) ? groups : `⚠️   ${groups}`,
            value: groups,
          }))
        : undefined
      : undefined

  return (
    <optionRow.OptionRow>
      <InputSelect
        name={`${pathPrefix}.groups`}
        isMulti
        isClearable={false}
        value={value}
        initialValues={availableGroups.map((group) => ({
          value: group,
          label: group,
        }))}
        onSelect={(selected) => {
          if (isMultiValueSelected(selected)) {
            setPath(
              `${pathPrefix}.groups`,
              selected.map((s) => s.value),
            )

            if (schemaType === "order-rules" && selected.length > 0) {
              setPath(`${pathPrefix}.selector`, "order.line_items")
            }
          }
        }}
      />
    </optionRow.OptionRow>
  )
}

function RoundOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem
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
  item: SchemaActionItem
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
  item: SchemaActionItem
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
  item: SchemaActionItem
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

function BundleOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem
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
  item: SchemaActionItem
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

function ApplyOnOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem
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
  item: SchemaActionItem
  pathPrefix: string
}) {
  const optionName = "identifiers" as const

  const { setPath } = useRuleEngine()
  // const [rerenderKey, setRerenderKey] = useState(0)
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (optionRow == null || optionRow.optionConfig?.required !== true) {
    return null
  }

  const selectedIdentifiers = optionName in item ? item.identifiers : {}

  const allValues = optionRow.optionConfig?.values ?? []

  return allValues.map(({ label, value }) => {
    const resourceType =
      value === "order.line_items.sku.id"
        ? "skus"
        : value === "order.line_items.bundle.id"
          ? "bundles"
          : value === "order.line_items.sku.sku_lists.id"
            ? "sku_lists"
            : undefined
    if (resourceType == null) {
      return null
    }
    return (
      <OptionRow
        label={
          <Text variant="info" size="small" className="flex gap-2 items-center">
            Free {label}
          </Text>
        }
        key={value}
      >
        <InputResourceSelector
          resource={resourceType}
          resourceKey="id"
          isMulti
          value={selectedIdentifiers[value] ?? []}
          onSelect={(selected) => {
            if (isMultiValueSelected(selected)) {
              if (selected.length > 0) {
                setPath(`${pathPrefix}.${optionName}`, {
                  ...selectedIdentifiers,
                  [value]: selected
                    .map((s) => s.value)
                    .filter((s) => s != null),
                })
              } else {
                const updatedIdentifiers = { ...selectedIdentifiers }
                delete updatedIdentifiers[value]
                setPath(`${pathPrefix}.${optionName}`, updatedIdentifiers)
              }
            }
          }}
        />
      </OptionRow>
    )
  })
}

const actionPaths = {
  "order-rules": [
    "order",
    "order.line_items",
    "order.line_items.line_item_options",
    "order.line_items.sku",
    "order.line_items.bundle",
    "order.line_items.shipment",
    "order.line_items.payment_method",
    "order.line_items.adjustment",
    "order.line_items.gift_card",
  ] as const,
  "price-rules": ["price"] as const,
} satisfies Record<RuleEngineProps["schemaType"], string[]>
