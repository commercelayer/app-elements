import React, { useEffect, useState } from "react"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
import { InputResourcePath } from "../InputResourcePath"
import { ListItemContainer } from "../layout/ListItemContainer"
import { OptionRow } from "../layout/OptionRow"
import { Options } from "../Options"
import { useAvailableOptions } from "../optionsConfig"
import { useRuleEngine } from "../RuleEngineContext"
import type { SchemaConditionItem } from "../utils"
import { ConditionMatcher } from "./ConditionMatcher"
import { ConditionValue } from "./ConditionValue"
import { useAvailableGroups } from "./hooks"

export function ConditionListItem({
  item,
  nestingLevel,
  pathPrefix,
  onDelete,
}: {
  item: SchemaConditionItem | null
  nestingLevel: number
  pathPrefix: string
  onDelete?: () => void
}): React.JSX.Element {
  const { setPath, optionsConfig } = useRuleEngine()

  const { available: availableOptions } = useAvailableOptions(
    item,
    optionsConfig.conditions,
  )

  const dropdownItems: React.ReactNode[][] = []

  if (nestingLevel < 2) {
    dropdownItems[0] ??= []
    dropdownItems[0].push(
      <DropdownItem
        label="Nest conditions"
        onClick={() => {
          setPath(
            `${pathPrefix}.nested.conditions.${(item?.nested?.conditions ?? []).length}`,
            undefined,
          )
        }}
      />,
    )
  }

  if (onDelete != null) {
    dropdownItems[1] ??= []
    dropdownItems[1].push(
      <DropdownItem
        label="Delete"
        onClick={() => {
          setPath(`${pathPrefix}`, null)
          onDelete()
        }}
      />,
    )
  }

  return (
    <div>
      <ListItemContainer
        dropdownItems={dropdownItems.map((items, index, arr) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
          <React.Fragment key={index}>
            {items.map((item, itemIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
              <React.Fragment key={itemIndex}>{item}</React.Fragment>
            ))}
            {index < arr.length - 1 && <DropdownDivider />}
          </React.Fragment>
        ))}
        options={
          <>
            <ConditionValue item={item} pathPrefix={pathPrefix} />
            <ConditionGroup item={item} pathPrefix={pathPrefix} />
            <Options item={item} pathPrefix={pathPrefix} />

            {availableOptions.length > 0 && (
              <Dropdown
                className="inline-flex mt-6"
                menuPosition="bottom-left"
                dropdownItems={availableOptions.map((option) => (
                  <DropdownItem
                    onClick={() => {
                      // Set default values based on option type
                      switch (option.name) {
                        case "scope":
                          setPath(`${pathPrefix}.scope`, "any")
                          break
                        case "aggregations":
                          setPath(`${pathPrefix}.aggregations`, [
                            {
                              field: "",
                              matcher: "eq",
                              operator: "sum",
                              value: 0,
                            },
                          ])
                          break
                      }
                    }}
                    label={option.label}
                    key={`option-${option.name}`}
                  />
                ))}
                dropdownLabel={
                  <button type="button">
                    <Text className="flex gap-2 items-center">
                      <Text weight="bold" size="small">
                        Add option
                      </Text>{" "}
                      <Icon name="caretDown" />
                    </Text>
                  </button>
                }
              />
            )}
          </>
        }
      >
        {/* Condition target */}
        <div className="flex-1">
          <InputResourcePath value={item?.field} name={`${pathPrefix}.field`} />
        </div>

        {/* Condition matcher */}
        <div>
          <ConditionMatcher item={item} pathPrefix={pathPrefix} />
        </div>
      </ListItemContainer>
    </div>
  )
}

const ConditionGroup: React.FC<{
  item: SchemaConditionItem | null
  pathPrefix: string
}> = ({ item, pathPrefix }) => {
  const { setPath } = useRuleEngine()
  const availableGroups = useAvailableGroups()

  const [group, setGroup] = useState<string | undefined>(item?.group)

  useEffect(() => {
    setPath(`${pathPrefix}.group`, group)
  }, [group])

  return (
    <OptionRow
      label={
        <Text variant="info" size="small">
          Groups
        </Text>
      }
    >
      <InputSelect
        name={`${pathPrefix}.group`}
        isCreatable
        isClearable
        initialValues={availableGroups.map((group) => ({
          value: group,
          label: group,
        }))}
        value={
          group != null
            ? {
                value: group,
                label: group,
              }
            : undefined
        }
        onSelect={(selected) => {
          if (selected == null || isSingleValueSelected(selected)) {
            setGroup(selected?.value.toString())
          }
        }}
        placeholder="Select or create group…"
      />
    </OptionRow>
  )
}
