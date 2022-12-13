import cn from 'classnames'

interface ListSimpleProps {
  children: React.ReactNode
  className?: string
}

export function ListSimple({
  children,
  className,
  ...rest
}: ListSimpleProps): JSX.Element {
  return (
    <div {...rest} className={cn('border-t border-gray-100 mb-20', className)}>
      {children}
    </div>
  )
}

export default ListSimple
