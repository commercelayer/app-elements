import cn from "classnames"
import type { JSX } from "react"
import {
  getInteractiveElementClassName,
  type InteractiveElementProps,
} from "../internals/InteractiveElement.className"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  InteractiveElementProps

/**
 * This component wraps a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) HTML element.
 * Button component is used to trigger an action or event, such as submitting a form, opening a Dialog, or performing an action.
 * <span type='info'>This component is always rendered as an accessible `<button>` HTML element. It has the same props from the `A` component, so it can renders as a link (UI only).</span>
 */
export function Button({
  alignItems,
  children,
  className,
  disabled,
  fullWidth,
  size = "regular",
  variant = "primary",
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
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
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

Button.displayName = "Button"
