import { Input } from '#ui/forms/Input'
import { InputSelect, isSingleValueSelected } from '#ui/forms/InputSelect'
import { expectNever, type SchemaActionItem, type SetPath } from '../utils'

export function Action({
  actions,
  selectedRuleIndex,
  setPath
}: {
  actions?: SchemaActionItem[]
  selectedRuleIndex: number
  setPath: SetPath
}): React.JSX.Element {
  return (
    <>
      {actions?.map((action, actionIndex) => (
        <ActionItem
          key={JSON.stringify(action)}
          item={action}
          setPath={setPath(`rules.${selectedRuleIndex}.actions.${actionIndex}`)}
        />
      ))}
      {(actions ?? []).length === 0 && (
        <ActionItem
          item={null}
          setPath={setPath(`rules.${selectedRuleIndex}.actions.${0}`)}
        />
      )}
    </>
  )
}

function ActionValue({
  item,
  setPath
}: {
  item: SchemaActionItem | null
  setPath: SetPath
}): React.ReactNode {
  if (item == null) {
    return null
  }

  switch (item.type) {
    case 'buy_x_pay_y':
      return (
        <div className='w-36'>
          <Input type='number' defaultValue={JSON.stringify(item.value)} />
        </div>
      )
    case 'every_x_discount_y':
      return (
        <div className='w-36'>
          <Input type='number' defaultValue={JSON.stringify(item.value)} />
        </div>
      )
    case 'fixed_amount':
    case 'fixed_price':
      return (
        <div className='w-36'>
          <Input
            type='number'
            defaultValue={item.value}
            min={0}
            suffix='cents'
            onChange={(event) => {
              setPath('value', parseInt(event.currentTarget.value, 10))
            }}
          />
        </div>
      )
    case 'percentage':
      return (
        <div className='w-20'>
          <Input
            type='number'
            defaultValue={item.value}
            min={0}
            max={100}
            suffix='%'
            onChange={(event) => {
              setPath('value', parseInt(event.currentTarget.value, 10))
            }}
          />
        </div>
      )
    default:
      return expectNever(item)
  }
}

function ActionItem({
  item,
  setPath
}: {
  item: SchemaActionItem | null
  setPath: SetPath
}): React.ReactNode {
  type Item = NonNullable<typeof item>
  const typeDictionary: Record<Item['type'], string> = {
    buy_x_pay_y: 'Buy X, Pay Y',
    every_x_discount_y: 'Every X, Discount Y',
    fixed_amount: 'Fixed amount',
    fixed_price: 'Fixed price',
    percentage: 'Percentage discount'
  }

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
                setPath('type', selected.value, true)
              }
            }}
          />
        </div>

        {/* Action value */}
        <ActionValue item={item} setPath={setPath} />

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
              setPath('selector', event.currentTarget.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}
