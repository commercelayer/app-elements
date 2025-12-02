import React from "react"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"
import { InputResourcePath } from "../InputResourcePath"
import { ListItemContainer } from "../layout/ListItemContainer"
import { Options } from "../Options"
import { useAvailableOptions } from "../optionsConfig"
import { useRuleEngine } from "../RuleEngineContext"
import type { SchemaConditionItem } from "../utils"
import { ConditionMatcher } from "./ConditionMatcher"
import { ConditionValue } from "./ConditionValue"

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
                          setPath(`${pathPrefix}.aggregations`, [{}])
                          break
                        case "group":
                          setPath(`${pathPrefix}.group`, null, true)
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
