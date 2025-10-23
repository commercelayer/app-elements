import cn from "classnames"
import { forwardRef, type JSX } from "react"
import {
  getFeedbackStyle,
  InputWrapper,
  type InputWrapperBaseProps,
} from "#ui/internals/InputWrapper"

export interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    InputWrapperBaseProps {}

export const InputTextArea = forwardRef<
  HTMLTextAreaElement,
  InputTextAreaProps
>(({ className, hint, label, feedback, inline, ...rest }, ref): JSX.Element => {
  return (
    <InputWrapper
      hint={hint}
      feedback={feedback}
      label={label}
      name={rest.id ?? rest.name}
      inline={inline}
    >
      <textarea
        {...rest}
        id={rest.id ?? rest.name}
        className={cn(
          className,
          "px-4 py-3 w-full bg-white rounded outline-0 text-sm leading-5",
          {
            "h-52": rest.rows == null,
          },
          getFeedbackStyle(feedback),
        )}
        ref={ref}
      />
    </InputWrapper>
  )
})

InputTextArea.displayName = "InputTextArea"
