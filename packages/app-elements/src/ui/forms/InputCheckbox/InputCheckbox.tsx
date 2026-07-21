import cn from "classnames"
import { forwardRef, type JSX, useState } from "react"
import {
  getFeedbackStyle,
  InputWrapper,
  type InputWrapperBaseProps,
} from "#ui/internals/InputWrapper"

export interface InputCheckboxProps
  extends Omit<InputWrapperBaseProps, "label" | "inline">,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  /**
   * Icon component
   * Example: `<Avatar>`
   */
  icon?: JSX.Element
  hideIconOnDesktop?: boolean
  /**
   * Additional `Element` to be rendered when the input is checked
   */
  checkedElement?: JSX.Element
  children?: React.ReactNode
  /**
   * Position of the checkbox relative to the main content.
   * When `right`, the checkbox is rendered after the content.
   * @default 'left'
   */
  checkboxPosition?: "left" | "right"
}

export const InputCheckbox = forwardRef<HTMLInputElement, InputCheckboxProps>(
  (
    {
      className,
      hint,
      feedback,
      icon,
      children,
      checkedElement,
      hideIconOnDesktop,
      checkboxPosition = "left",
      ...rest
    },
    ref,
  ): JSX.Element => {
    const [checked, setChecked] = useState<boolean>(
      rest.defaultChecked ?? rest.checked ?? false,
    )

    const inputCheckbox = (
      <input
        type="checkbox"
        onChangeCapture={(event) => {
          setChecked(event.currentTarget.checked)
          rest.onChangeCapture?.(event)
        }}
        onChange={(event) => {
          setChecked(event.currentTarget.checked)
          rest.onChange?.(event)
        }}
        data-testid="checkbox-input"
        className={cn(
          "w-5 h-5 text-primary focus:ring-primary",
          "border! border-solid! border-gray-300! rounded-sm",
          "[box-shadow:none]! checked:border-primary!",
          { "cursor-pointer": rest.disabled !== true },
          getFeedbackStyle(feedback),
        )}
        {...rest}
        ref={ref}
      />
    )

    return (
      <InputWrapper
        hint={hint}
        feedback={feedback}
        data-testid="checkbox-wrapper"
      >
        <div className={cn("flex items-center w-full", className)}>
          {/** biome-ignore lint/a11y/useKeyWithClickEvents: I need to stop event propagation */}
          {/** biome-ignore lint/a11y/noLabelWithoutControl: The input is present as variable, and always visible */}
          <label
            data-testid="checkbox-label"
            className={cn(
              "flex items-center gap-2 select-none flex-1 text-sm leading-5 py-0.5",
              {
                "cursor-pointer": rest.disabled !== true,
              },
            )}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {checkboxPosition === "left" && inputCheckbox}
            {children != null || icon != null ? (
              <div className="flex items-center gap-4 flex-1">
                {icon != null ? (
                  <div className={cn({ "md:hidden": hideIconOnDesktop })}>
                    {icon}
                  </div>
                ) : null}
                <div className="flex-1 text-sm font-medium">{children}</div>
              </div>
            ) : null}
            {checkboxPosition === "right" && inputCheckbox}
          </label>
        </div>
        {checkedElement != null && (rest.checked === true || checked) && (
          <div
            className={cn("my-2", {
              "ml-4.5 pl-4": checkboxPosition === "left",
              "mr-4.5 pr-4": checkboxPosition === "right",
            })}
          >
            {checkedElement}
          </div>
        )}
      </InputWrapper>
    )
  },
)

InputCheckbox.displayName = "InputCheckbox"
