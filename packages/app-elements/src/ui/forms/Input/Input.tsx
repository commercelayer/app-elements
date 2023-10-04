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
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { type = 'text', className, label, hint, feedback, inline, ...rest },
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
            rest.autoComplete === 'off' && '!bg-white',
            getFeedbackStyle(feedback)
          )}
          type={type}
          ref={ref}
        />
      </InputWrapper>
    )
  }
)

Input.displayName = 'Input'
