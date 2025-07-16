import cn from "classnames"
import { forwardRef, type JSX } from "react"
import {
  getFeedbackStyle,
  InputWrapper,
  type InputWrapperBaseProps,
} from "#ui/internals/InputWrapper"

export interface InputSwitchProps
  extends InputWrapperBaseProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {}

export const InputSwitch = forwardRef<HTMLInputElement, InputSwitchProps>(
  ({ className, label, hint, feedback, inline, ...rest }, ref): JSX.Element => {
    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        name={rest.id ?? rest.name}
        inline={inline}
      >
        <div className="flex">
          <div
            className={cn(
              "relative flex",
              "focus-within:rounded focus-within:outline focus-within:outline-2 focus-within:!outline-primary focus-within:outline-offset-2",
            )}
          >
            <input
              id={rest.id ?? rest.name}
              type="checkbox"
              className={cn(
                "absolute cursor-pointer top-0 left-0 w-full h-full peer appearance-none opacity-0 z-10",
              )}
              {...rest}
              ref={ref}
            />
            <span
              className={cn(
                "w-[29px] h-[18px] flex items-center flex-shrink-0 p-[2.5px] bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-primary after:w-[14px] after:h-[14px] after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-[9.5px]",
                getFeedbackStyle(feedback),
              )}
            />
          </div>
        </div>
      </InputWrapper>
    )
  },
)

InputSwitch.displayName = "InputSwitch"
