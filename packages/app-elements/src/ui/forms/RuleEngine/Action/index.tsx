import { Input } from '#ui/forms/Input'
import { InputSelect, isSingleValueSelected } from '#ui/forms/InputSelect'
import { useRuleEngine } from '../RuleEngineContext'
import { expectNever, type SchemaActionItem } from '../utils'

export function Action({
  actions
}: {
  actions?: SchemaActionItem[]
}): React.JSX.Element {
  const {
    state: { selectedRuleIndex }
  } = useRuleEngine()
  return (
    <>
      {actions?.map((action, actionIndex) => (
        <ActionItem
          key={`${selectedRuleIndex}-${actionIndex}`}
          item={action}
          index={actionIndex}
        />
      ))}
      {(actions ?? []).length === 0 && <ActionItem item={null} index={0} />}
    </>
  )
}

function ActionItem({
  item,
  index
}: {
  item: SchemaActionItem | null
  index: number
}): React.ReactNode {
  const {
    setPath,
    state: { selectedRuleIndex }
  } = useRuleEngine()

  type Item = NonNullable<typeof item>
  const typeDictionary: Record<Item['type'], string> = {
    buy_x_pay_y: 'Buy X, Pay Y',
    every_x_discount_y: 'Every X, Discount Y',
    fixed_amount: 'Fixed amount',
    fixed_price: 'Fixed price',
    percentage: 'Percentage discount'
  }

  const pathPrefix = `rules.${selectedRuleIndex}.actions.${index}`

  return (
    <div className='mb-6 last:mb-0'>
      <div className='bg-gray-50 rounded-md p-2 flex items-center justify-between gap-4'>
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
          {/* <InputSelect
            defaultValue={{ label: 'Line items', value: 'Line items' }}
            initialValues={[{ value: 'Line items', label: 'Line items' }]}
            onSelect={() => { }}
          /> */}
          <Input
            type='text'
            defaultValue={item != null ? item.selector : undefined}
            onChange={(event) => {
              setPath(`${pathPrefix}.selector`, event.currentTarget.value)
            }}
          />
        </div>
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
        <div className='w-36'>
          <Input type='number' defaultValue={JSON.stringify(item.value)} />
        </div>
      )
    }

    case 'every_x_discount_y': {
      return (
        <div className='w-36'>
          <Input type='number' defaultValue={JSON.stringify(item.value)} />
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
