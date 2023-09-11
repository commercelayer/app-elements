import {
  InputWrapper,
  getFeedbackStyle,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import cn from 'classnames'
import { forwardRef } from 'react'

export interface InputSwitchProps
  extends InputWrapperBaseProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {}

export const InputSwitch = forwardRef<HTMLInputElement, InputSwitchProps>(
  (
    { className, label, hint, feedback, inline: direction, ...rest },
    ref
  ): JSX.Element => {
    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        name={rest.id ?? rest.name}
        inline={direction}
      >
        <div className={cn('relative')}>
          <input
            id={rest.id ?? rest.name}
            type='checkbox'
            className={cn(
              'absolute cursor-pointer top-0 left-0 w-full h-full peer appearance-none opacity-0 z-10'
            )}
            {...rest}
            ref={ref}
          />
          <span
            className={cn(
              'w-8 h-5 flex items-center flex-shrink-0 p-[1px] bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-primary after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3',
              getFeedbackStyle(feedback)
            )}
          />
        </div>
      </InputWrapper>
    )
  }
)

InputSwitch.displayName = 'InputSwitch'
