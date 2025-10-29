import React, { useEffect, useState } from "react"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
import { InputResourcePath } from "../InputResourcePath"
import { OptionContainer } from "../Options/OptionContainer"
import { OptionRow } from "../Options/OptionRow"
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
  const { setPath } = useRuleEngine()

  const [optionVisibility, setOptionVisibility] = useState<boolean>(true)

  const dropdownItems: React.ReactNode[][] = []

  dropdownItems[0] ??= []

  if (nestingLevel < 2) {
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
      <div className="bg-gray-50 rounded-md flex items-center">
        <div className="flex items-center justify-between gap-2 grow p-2">
          <div className="flex flex-col gap-2 grow">
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

              {/* Condition actions */}
              <div className="border border-gray-200 rounded self-stretch flex">
                <button
                  type="button"
                  onClick={() => {
                    setOptionVisibility((prev) => !prev)
                  }}
                  className="w-11 flex self-stretch justify-center items-center"
                >
                  <Icon
                    name={optionVisibility ? "caretUp" : "caretDown"}
                    size={16}
                  />
                </button>
                {dropdownItems.length > 0 && (
                  <Dropdown
                    className="flex self-stretch border-gray-100 border-l"
                    dropdownLabel={
                      <button
                        type="button"
                        className="w-11 flex self-stretch justify-center items-center"
                      >
                        <Icon
                          name="dotsThreeVertical"
                          size={16}
                          weight="bold"
                        />
                      </button>
                    }
                    dropdownItems={dropdownItems.map((items, index, arr) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
                      <React.Fragment key={index}>
                        {items.map((item, itemIndex) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
                          <React.Fragment key={itemIndex}>
                            {item}
                          </React.Fragment>
                        ))}
                        {index < arr.length - 1 && <DropdownDivider />}
                      </React.Fragment>
                    ))}
                  />
                )}
              </div>
            </div>
            {optionVisibility && (
              <OptionContainer>
                <ConditionValue item={item} pathPrefix={pathPrefix} />
                <ConditionGroup item={item} pathPrefix={pathPrefix} />
              </OptionContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ConditionGroup: React.FC<{
  pathPrefix: string
  item: SchemaConditionItem | null
}> = ({ item, pathPrefix }) => {
  const { setPath } = useRuleEngine()
  const availableGroups = useAvailableGroups()

  const [group, setGroup] = useState<string | undefined>(item?.group)

  useEffect(() => {
    setPath(`${pathPrefix}.group`, group)
  }, [group])

  return (
    <OptionRow label={<Text variant="info">Groups</Text>}>
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
