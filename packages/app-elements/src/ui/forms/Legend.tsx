import cn from 'classnames'

interface Props extends React.HTMLAttributes<HTMLLegendElement> {
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
}: Props): JSX.Element {
  return (
    <legend
      {...rest}
      className={cn('block font-semibold leading-6', className, {
        'mb-2': gap
      })}
    >
      {children}
    </legend>
  )
}

Legend.displayName = 'Legend'
