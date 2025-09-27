import React from "react"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"
import { InputResourcePath } from "../InputResourcePath"
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
  const { setPath } = useRuleEngine()

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
    <div className="bg-gray-50 rounded-md flex items-center">
      <div className="flex items-center justify-between gap-2 grow p-2">
        <div className="flex flex-col gap-2 grow">
          {item?.group != null && (
            <div className="text-sm text-gray-500 p-2">
              group: <Text weight="bold">{item.group}</Text>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            {/* Condition target */}
            <div className="flex-1">
              <InputResourcePath
                value={item?.field}
                name={`${pathPrefix}.field`}
              />
            </div>

            {/* Condition matcher */}
            <div>
              <ConditionMatcher item={item} pathPrefix={pathPrefix} />
            </div>
          </div>
          <ConditionValue item={item} pathPrefix={pathPrefix} />
        </div>
      </div>
      {dropdownItems.length > 0 && (
        <Dropdown
          className="w-8 border-l border-gray-100 flex items-center justify-center self-stretch"
          dropdownLabel={
            <button
              type="button"
              className="flex items-center justify-center self-stretch grow"
            >
              <Icon name="dotsThreeVertical" size={16} weight="bold" />
            </button>
          }
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
        />
      )}
    </div>
  )
}
