import cn from "classnames"
import { forwardRef, type JSX } from "react"
import {
  getFeedbackStyle,
  InputWrapper,
  type InputWrapperBaseProps,
  useInputWrapperField,
} from "#ui/internals/InputWrapper"

export interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    InputWrapperBaseProps {}

export const InputTextArea = forwardRef<
  HTMLTextAreaElement,
  InputTextAreaProps
>(({ className, hint, label, feedback, inline, ...rest }, ref): JSX.Element => {
  const { wrapperProps, inputProps } = useInputWrapperField({
    id: rest.id,
    name: rest.name,
    feedback,
    hint,
    required: rest.required,
    "aria-describedby": rest["aria-describedby"],
  })
  return (
    <InputWrapper
      hint={hint}
      feedback={feedback}
      label={label}
      {...wrapperProps}
      inline={inline}
    >
      <textarea
        {...rest}
        {...inputProps}
        className={cn(
          className,
          "px-4 py-2.5 w-full bg-white rounded outline-0 font-normal text-sm",
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
