import cn from 'classnames'
import { type JSX } from 'react'

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
    <label
      {...rest}
      className={cn('block font-semibold leading-6', className, {
        'mb-2': gap
      })}
    >
      {children}
    </label>
  )
}

Label.displayName = 'Label'
