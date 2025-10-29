import React, { useEffect, useState } from "react"
import { Text } from "#ui/atoms/Text"
import { DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
import { InputResourcePath } from "../InputResourcePath"
import { ListItemContainer } from "../layout/ListItemContainer"
import { OptionRow } from "../layout/OptionRow"
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
