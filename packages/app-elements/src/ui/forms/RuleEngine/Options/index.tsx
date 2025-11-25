import type { KeysOfUnion } from "type-fest"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import { fetchCoreResourcesSuggestions } from "#ui/forms/CodeEditor/fetchCoreResourcesSuggestions"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
import { InputSwitch } from "#ui/forms/InputSwitch"
import { OptionRow } from "../layout/OptionRow"
import type { OptionConfig } from "../optionsConfig"
import { useRuleEngine } from "../RuleEngineContext"
import type { SchemaActionItem, SchemaConditionItem } from "../utils"

export function Options({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem | null
  pathPrefix: string
}) {
  return (
    <>
      <ApplyOnOption item={item} pathPrefix={pathPrefix} />
      <RoundOption item={item} pathPrefix={pathPrefix} />
      <DiscountModeOption item={item} pathPrefix={pathPrefix} />
      <ScopeOption item={item} pathPrefix={pathPrefix} />
    </>
  )
}

function RoundOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem | null
  pathPrefix: string
}) {
  const optionName = "round" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (item == null || !(optionName in item) || optionRow == null) {
    return null
  }

  return (
    <optionRow.OptionRow>
      <InputSwitch
        checked={item.round}
        onChange={(checked) => {
          setPath(`${pathPrefix}.round`, checked.currentTarget.checked)
        }}
      />
    </optionRow.OptionRow>
  )
}

function DiscountModeOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem | null
  pathPrefix: string
}) {
  const optionName = "discount_mode" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (item == null || !(optionName in item) || optionRow == null) {
    return null
  }

  return (
    <optionRow.OptionRow>
      <InputSelect
        initialValues={
          optionRow.optionConfig.enum?.map((v) => ({
            label: v,
            value: v,
          })) ?? []
        }
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
    </optionRow.OptionRow>
  )
}

function ScopeOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem | null
  pathPrefix: string
}) {
  const optionName = "scope" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (item == null || !(optionName in item) || optionRow == null) {
    return null
  }

  return (
    <optionRow.OptionRow>
      <InputSelect
        initialValues={
          optionRow.optionConfig.enum?.map((v) => ({
            label: v,
            value: v,
          })) ?? []
        }
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
    </optionRow.OptionRow>
  )
}

function ApplyOnOption({
  item,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem | null
  pathPrefix: string
}) {
  const optionName = "apply_on" as const

  const { setPath } = useRuleEngine()
  const optionRow = useOptionRow({ item, optionName, pathPrefix })

  if (item == null || !(optionName in item) || optionRow == null) {
    return null
  }

  return (
    <optionRow.OptionRow>
      <InputSelect
        initialValues={
          optionRow.optionConfig.enum?.map((v) => ({
            label: v,
            value: v,
          })) ?? []
        }
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
              const value = suggestion.value.replace(`${item.selector}.`, "")

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
    </optionRow.OptionRow>
  )
}

function useOptionRow({
  item,
  optionName,
  pathPrefix,
}: {
  item: SchemaActionItem | SchemaConditionItem | null
  optionName: KeysOfUnion<SchemaActionItem | SchemaConditionItem>
  pathPrefix: string
}): {
  optionConfig: OptionConfig
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

  if (item == null || !(optionName in item) || mainResourceId == null) {
    return null
  }

  const optionConfig =
    "type" in item
      ? optionsConfig.actions[item.type].find((opt) => opt.name === optionName)
      : optionsConfig.conditions.find((opt) => opt.name === optionName)

  if (optionConfig == null) {
    return null
  }

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
                    {optionConfig.label}
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
