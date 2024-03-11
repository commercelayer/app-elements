import { Text } from '#ui/atoms/Text'
import {
  InputWrapper,
  getFeedbackStyle,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import cn from 'classnames'
import { forwardRef } from 'react'

export interface InputProps
  extends InputWrapperBaseProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Controlled type
   */
  type?: 'text' | 'number' | 'password' | 'tel' | 'url' | 'email'
  /**
   * Optional CSS class names used for the input element
   */
  className?: string
  /**
   * Optional suffix that renders close to the right-edge of the input
   */
  suffix?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      className,
      label,
      hint,
      feedback,
      inline,
      suffix,
      ...rest
    },
    ref
  ): JSX.Element => {
    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        name={rest.id ?? rest.name}
        inline={inline}
      >
        <div className='relative'>
          <input
            {...rest}
            data-lpignore={rest.autoComplete === 'off' && 'true'}
            data-1p-ignore={rest.autoComplete === 'off' && true}
            data-form-type={rest.autoComplete === 'off' && 'other'}
            id={rest.id ?? rest.name}
            className={cn(
              className,
              'block w-full px-4 py-2.5 font-medium',
              'rounded outline-0',
              {
                '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none':
                  suffix != null,
                '!bg-white': rest.autoComplete === 'off'
              },
              getFeedbackStyle(feedback)
            )}
            type={type}
            ref={ref}
          />
          {suffix != null && (
            <Text
              size='small'
              weight='semibold'
              className='absolute right-4 top-1/2 -translate-y-1/2'
            >
              {suffix}
            </Text>
          )}
        </div>
      </InputWrapper>
    )
  }
)

Input.displayName = 'Input'
