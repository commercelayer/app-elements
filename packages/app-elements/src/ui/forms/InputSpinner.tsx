import {
  InputWrapper,
  getFeedbackStyle,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { Minus, Plus } from '@phosphor-icons/react'
import cn from 'classnames'
import { forwardRef, useCallback, useState } from 'react'

export interface InputSpinnerProps
  extends InputWrapperBaseProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'type' | 'value' | 'onChange'
    > {
  min?: number
  max?: number
  defaultValue?: number
  onChange: (value: number) => void
}

const InputSpinner = forwardRef<HTMLInputElement, InputSpinnerProps>(
  (
    {
      className,
      label,
      hint,
      feedback,
      min,
      max,
      defaultValue = 0,
      onChange,
      ...rest
    },
    ref
  ): JSX.Element => {
    const [value, setValue] = useState(defaultValue)
    const maxReached = max != null ? value >= max : false
    const minReached = min != null ? value <= min : false

    const handleUpdateValue = useCallback(
      (newValue: number) => {
        if (
          isNaN(newValue) ||
          (min != null && newValue < min) ||
          (max != null && newValue > max)
        ) {
          return
        }
        setValue(newValue)
        onChange(newValue)
      },
      [min, max, onChange]
    )

    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        name={rest.id ?? rest.name}
      >
        <div
          className={cn(
            className,
            'flex items-center justify-between rounded w-[122px]',
            'focus-within:ring-2 focus-within:ring-primary-500',
            getFeedbackStyle(feedback)
          )}
        >
          <ButtonSpin
            action='decrement'
            onClick={() => {
              handleUpdateValue(value - 1)
            }}
            disabled={minReached}
            data-test-id='InputSpinner-decrement'
          />
          <input
            type='number'
            ref={ref}
            data-test-id='InputSpinner-input'
            className={cn(
              'py-2.5 px-0 font-bold border-none min-w-0 text-center focus:ring-0',
              // reset browser default styles for number input
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            )}
            value={value}
            onChange={({ currentTarget }) => {
              const newValue = parseInt(currentTarget.value, 10)
              handleUpdateValue(newValue)
            }}
            {...rest}
          />
          <ButtonSpin
            action='increment'
            onClick={() => {
              handleUpdateValue(value + 1)
            }}
            disabled={maxReached}
            data-test-id='InputSpinner-increment'
          />
        </div>
      </InputWrapper>
    )
  }
)

InputSpinner.displayName = 'InputSpinner'
export { InputSpinner }

function ButtonSpin({
  onClick,
  disabled,
  action,
  ...rest
}: {
  onClick: () => void
  disabled: boolean
  action: 'increment' | 'decrement'
}): JSX.Element {
  return (
    <button
      type='button'
      className={cn('py-3 text-xl relative', {
        'text-gray-300': disabled,
        'active:top-[1px]': !disabled,
        'pl-3 pr-1': action === 'decrement',
        'pr-3 pl-1': action === 'increment'
      })}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {action === 'decrement' ? <Minus /> : <Plus />}
    </button>
  )
}
