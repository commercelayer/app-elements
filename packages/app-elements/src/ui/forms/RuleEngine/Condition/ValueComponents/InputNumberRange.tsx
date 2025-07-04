import { Input } from '#ui/forms/Input'
import React, { useState } from 'react'
import { type ItemWithValue } from '../../utils'

export function InputNumberRange({
  value,
  onChange
}: {
  value: ItemWithValue['value']
  onChange: (value: [number | null, number | null]) => void
}): React.JSX.Element {
  const [min, setMin] = useState<number | null>(
    Array.isArray(value) && typeof value[0] === 'number' ? value[0] : null
  )
  const [max, setMax] = useState<number | null>(
    Array.isArray(value) && typeof value[1] === 'number' ? value[1] : null
  )

  return (
    <div className='flex items-center gap-4'>
      <div className='flex-grow'>
        <Input
          type='number'
          placeholder='Min'
          value={min ?? ''}
          onChange={(event) => {
            const newValue = parseInt(event.currentTarget.value, 10)
            setMin(isNaN(newValue) ? null : newValue)
            onChange([isNaN(newValue) ? null : newValue, max])
          }}
        />
      </div>
      <span className='text-gray-300'>to</span>
      <div className='flex-grow'>
        <Input
          type='number'
          placeholder='Max'
          value={max ?? ''}
          onChange={(event) => {
            const newValue = parseInt(event.currentTarget.value, 10)
            setMax(isNaN(newValue) ? null : newValue)
            onChange([min, isNaN(newValue) ? null : newValue])
          }}
        />
      </div>
    </div>
  )
}
