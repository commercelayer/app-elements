import cn from 'classnames'
import { forwardRef } from 'react'
import {
  InputWrapper,
  InputWrapperBaseProps,
  getFeedbackStyle
} from '#ui/forms/InputWrapper'

interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    InputWrapperBaseProps {}

const InputTextArea = forwardRef<HTMLTextAreaElement, InputTextAreaProps>(
  ({ className, hint, label, feedback, ...rest }, ref): JSX.Element => {
    return (
      <InputWrapper
        hint={hint}
        feedback={feedback}
        label={label}
        name={rest.id ?? rest.name}
      >
        <textarea
          {...rest}
          id={rest.id ?? rest.name}
          className={cn(
            'h-52 px-4 py-2.5 w-full border bg-white rounded-md',
            getFeedbackStyle(feedback),
            className
          )}
          ref={ref}
        />
      </InputWrapper>
    )
  }
)

InputTextArea.displayName = 'InputTextArea'
export { InputTextArea }
