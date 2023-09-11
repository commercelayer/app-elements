import cn from 'classnames'

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
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
}: Props): JSX.Element {
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
