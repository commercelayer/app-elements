import cn from "classnames"
import type { JSX } from "react"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  gap?: boolean
}

/**
 * The Label component represents a caption for an item in a user interface.
 */
export function Label({
  gap,
  children,
  className,
  ...rest
}: LabelProps): JSX.Element {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: I need to use a label without an associated control
    <label
      {...rest}
      className={cn("block text-sm font-semibold leading-5", className, {
        "mb-2": gap,
      })}
    >
      {children}
    </label>
  )
}

Label.displayName = "Label"
