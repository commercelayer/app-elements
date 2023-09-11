import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { forwardRef, type ForwardedRef } from 'react'

export interface InputSimpleSelectOption {
  value: string
  label: string
}

export interface InputSimpleSelectProps
  extends InputWrapperBaseProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onSelect'> {
  value?: string
  options: InputSimpleSelectOption[]
  className?: string
}

export const InputSimpleSelect = forwardRef<
  HTMLSelectElement,
  InputSimpleSelectProps
>(
  (
    {
      className,
      value,
      options = [],
      label,
      hint,
      feedback,
      inline,
      ...rest
    }: InputSimpleSelectProps,
    ref: ForwardedRef<HTMLSelectElement>
  ): JSX.Element => {
    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        name={rest.id ?? rest.name}
        inline={inline}
      >
        <select
          id={rest.id ?? rest.name}
          value={value}
          className='appearance-none cursor-pointer border-0 py-0 pl-0 pr-9 font-medium text-gray-500 focus:outline-none focus:ring-0 focus:shadow-none'
          {...rest}
          ref={ref}
        >
          {options.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </InputWrapper>
    )
  }
)

InputSimpleSelect.displayName = 'InputSimpleSelect'
