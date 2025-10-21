import React, { useEffect, useRef, useState } from "react"
import { Button } from "#ui/atoms/Button"
import { Icon } from "#ui/atoms/Icon"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownDivider, DropdownItem } from "#ui/composite/Dropdown"
import { Modal, type ModalProps } from "#ui/composite/Modal"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
import { InputResourcePath } from "../InputResourcePath"
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

  const [showGroupModal, setShowGroupModal] = useState(false)

  const dropdownItems: React.ReactNode[][] = []

  dropdownItems[0] ??= []
  dropdownItems[0].push(
    <DropdownItem
      label="Set group"
      onClick={() => {
        setShowGroupModal(true)
      }}
    />,
  )

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
      <GroupModal
        onClose={() => setShowGroupModal(false)}
        show={showGroupModal}
        pathPrefix={pathPrefix}
        item={item}
      />
      {item?.group != null && (
        <div className="text-xs pb-4">
          Group: <Text weight="bold">{item.group}</Text>
        </div>
      )}
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
            </div>
            <ConditionValue item={item} pathPrefix={pathPrefix} />
          </div>
        </div>
        {dropdownItems.length > 0 && (
          <Dropdown
            className="w-8 border-l border-gray-100 flex items-center justify-center self-stretch shrink-0"
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
    </div>
  )
}

const GroupModal = ({
  show,
  onClose,
  pathPrefix,
  item,
}: Pick<ModalProps, "show" | "onClose"> & {
  pathPrefix: string
  item: SchemaConditionItem | null
}) => {
  const modal = useRef<HTMLDivElement | null>(null)
  const { setPath } = useRuleEngine()
  const availableGroups = useAvailableGroups()

  const [group, setGroup] = useState<string | undefined>(item?.group)

  useEffect(() => {
    setGroup(item?.group)
  }, [item?.group, show])

  return (
    <Modal ref={modal} show={show} onClose={onClose} size="large">
      <Modal.Header>Set group</Modal.Header>
      <Modal.Body>
        <InputSelect
          name={`${pathPrefix}.group`}
          isCreatable
          isClearable
          menuPortalTarget={modal.current}
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
        <Spacer top="2">
          <Text size="small" variant="info">
            Choose an existing group or create a new one. Leave empty to remove.
          </Text>
        </Spacer>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setPath(`${pathPrefix}.group`, group)
            onClose()
          }}
          fullWidth
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
