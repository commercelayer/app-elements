import { Icon } from '#ui/atoms/Icon'
import { Dropdown, DropdownDivider, DropdownItem } from '#ui/composite/Dropdown'
import { Input } from '#ui/forms/Input'
import React from 'react'
import { useRuleEngine } from '../RuleEngineContext'
import { type SchemaConditionItem } from '../utils'
import { ConditionMatcher } from './ConditionMatcher'
import { ConditionValue } from './ConditionValue'

export function ConditionListItem({
  item,
  nestingLevel,
  pathPrefix,
  onDelete
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
        label='Nest conditions'
        onClick={() => {
          setPath(
            `${pathPrefix}.nested.conditions.${(item?.nested?.conditions ?? []).length}`,
            undefined
          )
        }}
      />
    )
  }

  if (onDelete != null) {
    dropdownItems[1] ??= []
    dropdownItems[1].push(
      <DropdownItem
        label='Delete'
        onClick={() => {
          setPath(`${pathPrefix}`, null)
          onDelete()
        }}
      />
    )
  }

  return (
    <div className='bg-gray-50 rounded-md flex items-center'>
      <div className='flex items-center justify-between gap-2 flex-grow p-2'>
        <div className='flex flex-col gap-2 flex-grow'>
          <div className='flex items-center justify-between gap-2'>
            {/* Condition target */}
            <div className='flex-1'>
              <Input
                name={`${pathPrefix}.field`}
                type='text'
                // suffix={
                //   infos?.field?.type ? (
                //     <InputSimpleSelect
                //       defaultValue={infos.field?.type ?? 'string'}
                //       options={[
                //         { label: 'datetime', value: 'datetime' },
                //         { label: 'string', value: 'string' },
                //         { label: 'number', value: 'number' },
                //         { label: 'boolean', value: 'boolean' }
                //       ]}
                //     />
                //   ) : undefined
                // }
                defaultValue={item != null ? item.field : undefined}
                onChange={(event) => {
                  setPath(`${pathPrefix}.field`, event.currentTarget.value)
                }}
                onBlur={(event) => {
                  setPath(`${pathPrefix}.field`, event.currentTarget.value)
                }}
              />
            </div>

            {/* Condition matcher */}
            <div className='flex-14'>
              <ConditionMatcher item={item} pathPrefix={pathPrefix} />
            </div>
          </div>
          <ConditionValue item={item} pathPrefix={pathPrefix} />
        </div>
      </div>
      {dropdownItems.length > 0 && (
        <Dropdown
          className='w-8 border-l border-gray-100 flex items-center justify-center self-stretch'
          dropdownLabel={
            <button className='flex items-center justify-center self-stretch flex-grow'>
              <Icon name='dotsThreeVertical' size={16} weight='bold' />
            </button>
          }
          dropdownItems={dropdownItems.map((items, index, arr) => (
            <React.Fragment key={index}>
              {items.map((item, itemIndex) => (
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
