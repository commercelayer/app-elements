import { useState } from "react"
import { Button } from "#ui/atoms/Button"
import { Icon } from "#ui/atoms/Icon"
import { Dropdown, DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
import { useAvailableGroups } from "../Condition/hooks"
import { useRuleEngine } from "../RuleEngineContext"
import type { SchemaConditionItem } from "../utils"
import { AggregationRow, useOptionRow } from "./common"

export function ConditionOptions({
  item,
  pathPrefix,
}: {
  item: SchemaConditionItem | null
  pathPrefix: string
}) {
  if (item == null) {
    return null
  }

  return (
    <>
      <GroupOption item={item} pathPrefix={pathPrefix} />
      <ScopeOption item={item} pathPrefix={pathPrefix} />
      <AggregationsOption item={item} pathPrefix={pathPrefix} />
    </>
  )
}

function GroupOption({
  item,
  pathPrefix,
}: {
  item: SchemaConditionItem
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

function AggregationsOption({
  item,
  pathPrefix,
}: {
  item: SchemaConditionItem
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

function ScopeOption({
  item,
  pathPrefix,
}: {
  item: SchemaConditionItem
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
