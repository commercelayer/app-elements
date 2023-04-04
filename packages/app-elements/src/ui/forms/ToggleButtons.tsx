import { Spacer } from '#ui/atoms/Spacer'
import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/forms/InputWrapper'
import cn from 'classnames'
import { type Simplify } from 'type-fest'

interface ToggleItemProps {
  label: string
  isChecked?: boolean
  isDisabled?: boolean
  onToggle: () => void
}

function ToggleItem({
  label,
  isChecked,
  isDisabled = false,
  onToggle
}: ToggleItemProps): JSX.Element {
  return (
    <label
      className={cn(
        'border-none rounded px-4 py-2 leading-6 cursor-pointer font-bold text-sm select-none hover:opacity-80',
        {
          'opacity-50 pointer-events-none touch-none': isDisabled,
          'focus-within:ring-2': !isDisabled,
          'bg-gray-100 text-gray-500': isChecked !== true,
          'bg-primary text-white': isChecked === true
        }
      )}
    >
      <input
        type='checkbox'
        checked={isChecked}
        disabled={isDisabled}
        onChange={onToggle}
        className='absolute opacity-0 cursor-pointer'
      />
      {label}
    </label>
  )
}

export type ToggleButtonValue = string | boolean | number

export interface ToggleButtonOption {
  label: string
  value: ToggleButtonValue
  isDisabled?: boolean
}

interface BaseProps
  extends InputWrapperBaseProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: ToggleButtonOption[]
}

interface SingleValueProps {
  mode: 'single'
  value?: ToggleButtonValue
  onChange: (value?: ToggleButtonValue) => void
}
interface MultiValuesProps {
  mode: 'multi'
  value?: ToggleButtonValue[]
  onChange: (values: ToggleButtonValue[]) => void
}

export type ToggleButtonsProps = Simplify<
  BaseProps & (SingleValueProps | MultiValuesProps)
>

function ToggleButtons({
  options,
  value,
  mode,
  onChange,
  label,
  hint,
  feedback,
  ...rest
}: ToggleButtonsProps): JSX.Element {
  return (
    <InputWrapper
      hint={hint}
      feedback={feedback}
      data-test-id='toggle-buttons'
      {...rest}
    >
      <fieldset>
        {label != null ? (
          <Spacer bottom='4'>
            <legend className='text-gray-500 font-medium'>{label}</legend>
          </Spacer>
        ) : null}

        <div className='flex gap-2 flex-wrap'>
          {options.map((opt) => {
            const isChecked = Boolean(
              mode === 'multi'
                ? value?.includes(opt.value)
                : opt.value === value
            )
            const handleToggle = (): void => {
              if (mode === 'multi') {
                // when is multi values mode, we need to add or remove from current values
                const currentValues = value ?? []
                const newValues = isChecked
                  ? currentValues.filter((v) => v !== opt.value)
                  : [...currentValues, opt.value]
                onChange(newValues)
              } else {
                // when is single value mode, we need also to handle the un-check action
                onChange(isChecked ? undefined : opt.value)
              }
            }
            return (
              <ToggleItem
                key={opt.label}
                label={opt.label}
                isChecked={isChecked}
                isDisabled={opt.isDisabled}
                onToggle={handleToggle}
              />
            )
          })}
        </div>
      </fieldset>
    </InputWrapper>
  )
}

ToggleButtons.displayName = 'ToggleButtons'
export { ToggleButtons }
