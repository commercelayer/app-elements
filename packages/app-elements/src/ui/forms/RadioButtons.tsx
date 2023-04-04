import cn from 'classnames'
import { type InputHTMLAttributes, forwardRef } from 'react'
import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/forms/InputWrapper'

export type RadioOptionValue = string | number | boolean

export interface RadioOption {
  value: RadioOptionValue
  label: string
}

export interface RadioButtonsProps extends InputWrapperBaseProps {
  id: string
  options: RadioOption[]
  value?: RadioOptionValue
  onChange: (value: RadioOptionValue) => void
  className?: string
  onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur']
}

const RadioButtons = forwardRef<HTMLInputElement, RadioButtonsProps>(
  (
    {
      id = 'radio-buttons',
      options = [],
      value,
      onChange,
      onBlur,
      className,
      label,
      hint,
      feedback,
      ...rest
    },
    ref
  ): JSX.Element => {
    return (
      <InputWrapper
        className={className}
        {...rest}
        hint={hint}
        feedback={feedback}
        label={label}
      >
        {options.map((opt, idx) => (
          <div key={`${id}_${idx}`} className='mb-3 last:mb-0'>
            <div className='flex items-center'>
              <div className='rounded-full w-[18px] h-[18px] flex items-center '>
                <input
                  aria-labelledby={`label_${id}_${idx}`}
                  id={`${id}_${idx}`}
                  data-test-id={`${id}_${idx}`}
                  name={`${id}`}
                  type='radio'
                  value={opt.value.toString()}
                  checked={value === opt.value}
                  className={cn([
                    'cursor-pointer w-full h-full',
                    'border border-gray-300 text-primary',
                    'checked:border-none',
                    'focus:ring-0 focus:ring-offset-0'
                    // 'focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none'
                  ])}
                  onChange={() => {
                    onChange(opt.value)
                  }}
                  onBlur={onBlur}
                  ref={ref}
                />
              </div>
              <label
                id={`label_${id}_${idx}`}
                htmlFor={`${id}_${idx}`}
                className='ml-2 font-semibold cursor-pointer'
              >
                {opt.label}
              </label>
            </div>
          </div>
        ))}
      </InputWrapper>
    )
  }
)

RadioButtons.displayName = 'RadioButtons'
export { RadioButtons }
