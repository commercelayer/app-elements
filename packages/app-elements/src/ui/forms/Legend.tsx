import cn from "classnames"
import type { JSX } from "react"

export interface LegendProps extends React.HTMLAttributes<HTMLLegendElement> {
  gap?: boolean
}

/**
 * The Legend component represents a caption for the content of its parent <fieldset>.
 *
 * It is styled exactly like the `<Label>` component.
 */
export function Legend({
  gap,
  children,
  className,
  ...rest
}: LegendProps): JSX.Element {
  return (
    <legend
      {...rest}
      className={cn("block text-sm font-semibold leading-5", className, {
        "mb-2": gap,
      })}
    >
      {children}
    </legend>
  )
}

Legend.displayName = "Legend"
