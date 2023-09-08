import cn from 'classnames'

interface Props extends React.HTMLAttributes<HTMLLegendElement> {
  gap?: boolean
}

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
