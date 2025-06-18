import { Input } from '#ui/forms/Input'
import { useRuleEngine } from '../RuleEngineContext'
import { expectNever, type SchemaActionItem } from '../utils'

export function ActionValue({
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
