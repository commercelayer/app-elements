import cn from "classnames"
import type { JSX } from "react"
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components"
import {
  getInteractiveElementClassName,
  type InteractiveElementProps,
} from "../internals/InteractiveElement.className"

export type ButtonProps = Omit<
  AriaButtonProps,
  "isDisabled" | "children" | "className"
> &
  InteractiveElementProps & {
    /**
     * When button is disabled, the user cannot interact with it
     */
    disabled?: boolean
    /**
     * Additional CSS class name(s) to apply to the button
     */
    className?: string
  }

/**
 * This component wraps React Aria's `Button` component with accessibility features built-in.
 * Button component is used to trigger an action or event, such as submitting a form, opening a Dialog, or performing an action.
 * <span type='info'>This component provides accessible button interactions with mouse, keyboard, and touch support via the `onPress` prop.</span>
 */
export function Button({
  alignItems,
  children,
  className,
  disabled,
  fullWidth,
  isPending,
  size = "regular",
  variant = "primary",
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <AriaButton
      className={cn(
        className,
        getInteractiveElementClassName({
          alignItems,
          children,
          disabled,
          fullWidth,
          size,
          variant,
        }),
      )}
      isDisabled={disabled}
      {...rest}
    >
      {children}
    </AriaButton>
  )
}

Button.displayName = "Button"
