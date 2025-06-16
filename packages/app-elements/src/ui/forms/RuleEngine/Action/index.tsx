import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { Dropdown, DropdownItem } from '#ui/composite/Dropdown'
import { Input } from '#ui/forms/Input'
import { InputSelect, isSingleValueSelected } from '#ui/forms/InputSelect'
import { useState } from 'react'
import { useRuleEngine } from '../RuleEngineContext'
import { expectNever, type SchemaActionItem } from '../utils'

export function Action({
  actions
}: {
  actions?: SchemaActionItem[]
}): React.JSX.Element {
  const [rerenderKey, setRerenderKey] = useState(0)
  const {
    setPath,
    state: { selectedRuleIndex }
  } = useRuleEngine()

  return (
    <>
      <div>
        {actions?.map((action, actionIndex, actionArray) => (
          <ActionItem
            key={`${selectedRuleIndex}-${actionIndex}-${rerenderKey}`}
            item={action}
            index={actionIndex}
            onDelete={
              actionArray.length > 1
                ? () => {
                    setRerenderKey((prevKey) => prevKey + 1)
                  }
                : undefined
            }
          />
        ))}
        {/* {(actions ?? []).length === 0 && <ActionItem item={null} index={0} />} */}
      </div>
      <div className='mt-6'>
        <Button
          size='small'
          variant='secondary'
          alignItems='center'
          onClick={() => {
            setPath(
              `rules.${selectedRuleIndex}.actions.${actions?.length ?? 0}`,
              undefined
            )
          }}
        >
          <Icon name='plusCircle' /> Add action
        </Button>
      </div>
    </>
  )
}

function ActionItem({
  item,
  index,
  onDelete
}: {
  item: SchemaActionItem | null
  index: number
  onDelete?: () => void
}): React.ReactNode {
  const {
    setPath,
    state: { selectedRuleIndex }
  } = useRuleEngine()

  type Item = NonNullable<typeof item>
  const typeDictionary: Record<Item['type'], string> = {
    percentage: 'Percentage discount',
    fixed_amount: 'Fixed amount',
    fixed_price: 'Fixed price',
    buy_x_pay_y: 'Buy X, Pay Y',
    every_x_discount_y: 'Every X, Discount Y'
  }

  const pathPrefix = `rules.${selectedRuleIndex}.actions.${index}`

  return (
    <div className='mb-4 last:mb-0'>
      <div className='bg-gray-50 rounded-md flex items-center'>
        <div className='flex items-center justify-between gap-2 flex-grow p-2'>
          {/* Action type */}
          <div className='flex-1'>
            <InputSelect
              defaultValue={
                item != null
                  ? {
                      label: typeDictionary[item.type],
                      value: item.type
                    }
                  : undefined
              }
              initialValues={Object.entries(typeDictionary).map(
                ([value, label]) => ({ value, label })
              )}
              onSelect={(selected) => {
                if (isSingleValueSelected(selected)) {
                  setPath(`${pathPrefix}.type`, selected.value)
                }
              }}
            />
          </div>

          {/* Action value */}
          <ActionValue item={item} pathPrefix={pathPrefix} />

          {/* ON */}
          <div className='text-black font-bold text-sm'>ON</div>

          {/* Action target */}
          <div className='flex-1'>
            <Input
              type='text'
              defaultValue={item != null ? item.selector : undefined}
              onChange={(event) => {
                setPath(`${pathPrefix}.selector`, event.currentTarget.value)
              }}
            />
          </div>
        </div>
        {onDelete != null && (
          <Dropdown
            className='w-8 border-l border-gray-100 flex items-center justify-center self-stretch'
            dropdownLabel={
              <button className='flex items-center justify-center self-stretch flex-grow'>
                <Icon name='dotsThreeVertical' size={16} weight='bold' />
              </button>
            }
            dropdownItems={
              <>
                <DropdownItem
                  label='Delete'
                  onClick={() => {
                    setPath(`${pathPrefix}`, null)
                    onDelete()
                  }}
                />
              </>
            }
          />
        )}
      </div>
    </div>
  )
}

function ActionValue({
  item,
  pathPrefix
}: {
  item: SchemaActionItem | null
  pathPrefix: string
}): React.ReactNode {
  const { setPath } = useRuleEngine()
  if (item == null) {
    return null
  }

  switch (item.type) {
    case 'buy_x_pay_y': {
      return (
        <div className='w-36 flex items-center gap-0.5'>
          <Input
            type='number'
            suffix='X'
            defaultValue={item.value?.x}
            onChange={(event) => {
              setPath(
                `${pathPrefix}.value.x`,
                parseInt(event.currentTarget.value, 10)
              )
            }}
          />
          <Input
            type='number'
            suffix='Y'
            defaultValue={item.value?.y}
            onChange={(event) => {
              setPath(
                `${pathPrefix}.value.y`,
                parseInt(event.currentTarget.value, 10)
              )
            }}
          />
        </div>
      )
    }

    case 'every_x_discount_y': {
      return (
        <div className='w-36 flex items-center gap-0.5'>
          <Input
            type='number'
            suffix='X'
            defaultValue={item.value?.x}
            onChange={(event) => {
              setPath(
                `${pathPrefix}.value.x`,
                parseInt(event.currentTarget.value, 10)
              )
            }}
          />
          <Input
            type='number'
            suffix='Y'
            defaultValue={item.value?.y}
            onChange={(event) => {
              setPath(
                `${pathPrefix}.value.y`,
                parseInt(event.currentTarget.value, 10)
              )
            }}
          />
        </div>
      )
    }

    case 'fixed_amount':
    case 'fixed_price': {
      return (
        <div className='w-36'>
          <Input
            type='number'
            defaultValue={item.value}
            min={0}
            suffix='cents'
            onChange={(event) => {
              setPath(
                `${pathPrefix}.value`,
                parseInt(event.currentTarget.value, 10)
              )
            }}
          />
        </div>
      )
    }

    case 'percentage': {
      const percentageValue = (item.value * 100).toFixed(2)
      return (
        <div className='w-24'>
          <Input
            type='number'
            defaultValue={
              percentageValue.endsWith('.00')
                ? percentageValue.slice(0, -3)
                : percentageValue
            }
            min={0}
            max={100}
            suffix='%'
            onChange={(event) => {
              setPath(
                `${pathPrefix}.value`,
                parseFloat(event.currentTarget.value) / 100
              )
            }}
          />
        </div>
      )
    }

    default: {
      return expectNever(item)
    }
  }
}
