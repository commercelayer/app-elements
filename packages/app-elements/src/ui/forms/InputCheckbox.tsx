import {
  type InputWrapperBaseProps,
  getFeedbackStyle
} from '#ui/forms/InputWrapper'
import cn from 'classnames'
import { type ReactNode, forwardRef } from 'react'
import { InputWrapper } from './InputWrapper'

export interface InputCheckboxProps
  extends Omit<InputWrapperBaseProps, 'label'>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  /**
   * Icon component
   * Example: `<Avatar>`
   */
  icon?: JSX.Element
  children: ReactNode
}

const InputCheckbox = forwardRef<HTMLInputElement, InputCheckboxProps>(
  (
    { className, hint, feedback, icon, children, ...rest },
    ref
  ): JSX.Element => {
    return (
      <InputWrapper
        hint={hint}
        feedback={feedback}
        data-test-id='checkbox-wrapper'
      >
        <div className={cn('flex items-center w-full', className)}>
          <label
            data-test-id='checkbox-label'
            className={cn('flex items-center gap-4 select-none', className, {
              'cursor-pointer': rest.disabled !== true
            })}
          >
            <input
              type='checkbox'
              data-test-id='checkbox-input'
              className={cn(
                'border border-gray-300 rounded w-[18px] h-[18px] text-primary focus:ring-primary',
                { 'cursor-pointer': rest.disabled !== true },
                getFeedbackStyle(feedback)
              )}
              {...rest}
              ref={ref}
            />

            <div className='flex items-center gap-4 flex-1'>
              {icon != null ? icon : null}
              {children}
            </div>
          </label>
        </div>
      </InputWrapper>
    )
  }
)

InputCheckbox.displayName = 'InputCheckbox'
export { InputCheckbox }
